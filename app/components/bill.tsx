import React, { useRef, useEffect, useState } from 'react'
import { jsPDF } from 'jspdf'
import "jspdf-autotable"
import Payment from './payment'
import Notification from './notification'
  
export default function bill({ style, tableButton, closeTablesUI, setTableNumber, tableNumber, setDataLoaded , setSelectedItems, title}) {
    const [nbOfTables, setNumbTables] = useState(52)
    const [toggle,setToggle] = useState(false)
    const modalRef = useRef(null)
    const [tables, setTables] = useState([])
    const [orders, setOrders] = useState([])
    const currentDate = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes} nz timezone`
    const date = currentDate.toLocaleDateString('en-GB', options);
    const COMPANY_NAME = 'Portofino'
    const [total, setTotal] = useState(0)
    const [staff, setStaff] = useState('John')
    const [togglePayment, setTogglePayment] = useState(false)
    const [loadData, setLoadData] = useState(true)
    const [localTableNumber,setLocalTableNumber] = useState(0)
    const [isTablePaid, setTablePaid] = useState(false)
    const [notify,setNotify] = useState({state:false, color:'', message:''})
    
    useEffect(() => {
        fetchTables()
      }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const url = `http://localhost:8000/api/items/fetchOrders`
                const response = await fetch(url,
                {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tableId : localTableNumber }),
                });
                const { orders, message } = await response.json()
                
                let sum = 0;
                if(orders) {
                    orders.forEach(order => {
                        sum += order.item.price * order.quantity;
                    });
                    setTotal(sum);
                    setOrders(orders);
                } 
                if(orders.length == 0) setLoadData(false)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
        if(toggle) fetchOrders()
        if(isTablePaid) {
            closeModal()
            setTogglePayment(false)
            setTimeout(() => {
                setTablePaid(false)
                fetchTables()
            },2500)
        }

    }, [toggle, isTablePaid])

    const fetchTables = async () => {
        try {
            const url = `http://localhost:8000/api/items/fetchTables`
            const response = await fetch(url,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const { tables, message } = await response.json();
            setTables(tables == undefined ? [] : tables);
          } catch (error) {
            console.error('Error:', error);
          }
        };

    const sendTableNumber = (e: React.MouseEvent<HTMLButtonElement>) => {
        const table = e.currentTarget.value
        setDataLoaded(false)
        setTableNumber(table)
        closeTables()
    }

    // when checking the bill
    const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        const table = e.currentTarget.value
        setToggle(true)
        setLocalTableNumber(table)
    }

    const closeModal = () => {
        setToggle(false)
    }

    const closeTables = () => {
        closeTablesUI()
    }

    const generateBillPDF = () => {
        // Default export is a4 paper, portrait, using millimeters for units
        const doc = new jsPDF();
        const fileName = 'bill'

        // header HTML
        const header =  document.getElementById('header')?.textContent?.toUpperCase()
        let pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getStringUnitWidth(header) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const x = pageWidth - textWidth - 15;
        doc.text(header, x, 10);

        // table HTML
        const table = document.getElementById('tableBill')
        const tableHeaderRow  = table.getElementsByTagName('thead')[0].querySelector('tr');
        const tableHeader = Array.from(tableHeaderRow.cells).map(cell => cell.textContent);
        const tableBodyRows = table.getElementsByTagName('tbody')[0].querySelectorAll('tr');
        
        const tableBody = Array.from(tableBodyRows).map(row => {
            const rowData = Array.from(row.cells).map(cell => cell.textContent)
            return rowData
        });
        
        doc.autoTable({
            head: [tableHeader],
            body: tableBody,
        });

        // footer HTML
        const footer =  document.getElementById('footer').innerText
        pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        // Set the position coordinates for the footer
        const footerX = pageWidth - 15;
        const footerY = pageHeight - 70;

        doc.setFillColor('pink');
        doc.setDrawColor('gray');
        doc.setLineWidth('1');
        doc.rect(footerX - 38, footerY - 5, 40, 50, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(footer, footerX, footerY,{
            align: 'right',
        });


        // detail HTML
        const detail =  document.getElementById('detail').innerText
        pageWidth = doc.internal.pageSize.getWidth();
        doc.text(detail, 15, footerY,{
            align: 'left',
        });

        doc.save(fileName + '.pdf');
        console.log('pdf is generated')
    }
    
    const togglePaymentModal = () => {
        setTogglePayment(true)
    }
    
    return (
        <div>
            <div className={`flex flex-col items-center ${style}`}>
                {
                    isTablePaid ? <Notification notify={notify} setNotify={setNotify} duration={Math.max(notify.message.length * 70, 2000)} /> : null
                }
                {
                    tableButton && (
                        <button onClick={() => closeTables()} className="text-4xl font-bold uppercase text-center m-4 p-4 bg-red-400 hover:bg-red-600 hover:text-white absolute right-0 top-0">x</button>
                    )
                }
                <div className='text-white text-4xl uppercase font-bold m-4'>{title}</div>
                <div className='flex flex-wrap md:w-8/12 lg:w-8/12 justify-center gap-2 m-2'>
                {
                    Array.from({ length: nbOfTables }).map((_, index) => (
                    <div key={index + 1}>
                        {
                            tableButton && (
                                <button 
                                    onClick={tableButton ? (e) => sendTableNumber(e) : (e) => openModal(e)}
                                    disabled={tableNumber == index + 1 ? true : false} 
                                    className={`${tables && tables.find(table => table._id == index + 1) ?  'text-white bg-yellow-600' : 'bg-white' } 
                                    ${tableNumber == index + 1 ? 'disabled:opacity-70 cursor-no-drop' : 'hover:bg-orange-400'}
                                    text-xl w-16 font-bold rounded-full p-4`} 
                                    value={index + 1}>
                                    {index + 1}
                                </button>
                            )
                        }
                        {
                            !tableButton && (
                                <button 
                                    onClick={tableButton ? (e) => sendTableNumber(e) : (e) => openModal(e)}
                                    disabled={tables && tables.find(table => table._id == index + 1) ? false : true} 
                                    className={`${tables && tables.find(table => table._id == index + 1) ?  'text-white bg-yellow-600 hover:bg-orange-400' :'disabled:opacity-70 cursor-no-drop' } 
                                    text-xl w-16 font-bold rounded-full p-4 bg-white `} 
                                    value={index + 1}>
                                    {index + 1}
                                </button>
                            )
                        }
                    </div>
                    ))
                }
                </div>
            </div>
            {/* modal || tableButton is used in a different component (review-order) */}
            {   
                toggle && (
                    <div className={`absolute z-20 inset-0 flex items-center justify-center h-screen `} >
                        <div className={'w-11/12 h-[90%] bg-white relative ...'} ref={modalRef}>
                            <div className='flex justify-center items-center'>
                                <p id='header' className="text-4xl font-bold uppercase text-center m-4">invoice for table {localTableNumber}</p>
                                <button 
                                    name="modal"
                                    onClick={closeModal}
                                    className="text-4xl font-bold uppercase text-center m-4 p-4 bg-red-400 hover:bg-red-600 hover:text-white absolute right-0 top-0"
                                    >x</button>
                            </div>
                            {/* fetch from database the orders */}
                            <div id='tableBill' className='w-6/12 max-h-[90%] bg-gray-100 m-auto relative'>
                                <table className='w-full table-fixed text-right'>
                                    <thead className='sticky top-0 bg-white'>
                                        <tr>
                                            <th className='border p-4'>Name</th>
                                            <th className='border p-4'>Quantity</th>
                                            <th className='border p-4'>Price Per Unit</th>
                                            <th className='border p-4'>Total ($)</th>
                                        </tr>
                                    </thead>
                                </table>
                                <div className='w-full overflow-y-auto max-h-[540px]'>
                                    <table className='w-full table-fixed text-right'>
                                        <tbody>
                                        {
                                            orders && orders.length > 0 ? (
                                                (() => {
                                                // Step 1: Initialize merged items object
                                                const mergedItems = {};

                                                // Step 2: Merge duplicate items
                                                orders.forEach((detail) => {
                                                    const ID = detail.item.id.split('_')[0];
                                                    const quantity = detail.quantity;
                                                    
                                                    if (mergedItems[ID]) {
                                                    // Step 3: Update quantity of existing item
                                                    mergedItems[ID].quantity += quantity
                                                    } else {
                                                    // Step 4: Add new item
                                                    mergedItems[ID] = {
                                                        _id: ID,
                                                        item: detail.item,
                                                        quantity: quantity,
                                                    };
                                                    }
                                                });

                                                // Step 5: Render merged items
                                                return Object.values(mergedItems).map((mergedDetail) => (
                                                    <tr key={`${mergedDetail._id}`}>
                                                    <td className='p-4 border-b font-medium'>{mergedDetail.item.name}</td>
                                                    <td className='p-4 border-b'>{mergedDetail.quantity}</td>
                                                    <td className='p-4 border-b'>{mergedDetail.item.price}</td>
                                                    <td className='p-4 border-b font-bold'>
                                                        {mergedDetail.quantity * mergedDetail.item.price}
                                                    </td>
                                                    </tr>
                                                ));
                                                })()
                                            ) : (
                                                <tr>
                                                <td className='uppercase font-bold text-2xl text-center p-2'>
                                                    {loadData ? 'loading...' : 'no data found'}
                                                </td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                <div className='uppercase flex font-medium bg-green-200 w-full h-[160px] sticky z-50 bottom-0 left-0 border-t-4 border-slate-500 p-4'>
                                    <div id='detail' className='basis-1/2'>
                                        <div>Company Name: {COMPANY_NAME}</div>
                                        <div>date of purchase: {date}</div>
                                        <div>at {currentTime}</div>
                                        <div>Served by: {staff}</div>
                                    </div>
                                    <div id='footer' className='flex flex-col basis-1/2 '>
                                        <div className='flex gap-4 place-content-end'>
                                            <p>subtotal</p>
                                            <p className='font-bold'>$ {(total-(total * 0.15)).toFixed(2)}</p>
                                        </div>
                                        <div className='flex gap-4 place-content-end'>
                                            <p>include gst (15%)</p>
                                            <p className='font-bold'>$ {(total * 0.15).toFixed(2)}</p>
                                        </div>
                                        <div className='flex gap-4 place-content-end'>
                                            <p>total</p>
                                            <p className='font-bold'>$ {total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col absolute bottom-0 right-0 gap-2 m-3'>
                                <button name="modal" onClick={closeModal} className="text-4xl font-bold uppercase text-center p-4 bg-red-400 hover:bg-red-600 hover:text-white ">close</button>
                                <button onClick={() => generateBillPDF()} className="text-4xl font-bold uppercase text-center p-4 bg-slate-400 hover:bg-slate-600 hover:text-white ">print</button>
                                <button onClick={(e) => togglePaymentModal()} disabled={togglePayment} className={`${togglePayment ? 'disabled:opacity-70 cursor-no-drop' : 'hover:bg-slate-600 hover:text-white'} text-4xl font-bold uppercase text-center p-4 bg-slate-400`}>pay</button>
                            </div>
                            {
                                togglePayment && (
                                    <Payment setNotifyBill={setNotify} setTogglePayment={setTogglePayment} total={total} tableNumber={localTableNumber} isTablePaid={isTablePaid} setTablePaid={setTablePaid} />
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}
