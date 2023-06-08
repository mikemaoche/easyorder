import React, { useRef, useEffect, useState } from 'react'
  
export default function bill({ style, tableButton, closeTablesUI, getTableNumber }) {
    const [nbOfTables, setNumbTables] = useState(52)
    const [toggle,setToggle] = useState(false)
    const [tableNumber,setTableNumber] = useState(0)
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

    useEffect(() => {
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
                setTables(tables);
              } catch (error) {
                console.error('Error:', error);
              }
            };
        
        if(!toggle) fetchTables()

        const fetchOrders = async () => {
            try {
                const url = `http://localhost:8000/api/items/fetchOrders`
                const response = await fetch(url,
                {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tableId : tableNumber }),
                });
                const { orders, message } = await response.json()
                setOrders(orders);
                } catch (error) {
                console.error('Error:', error);
            }
        }
        if(toggle) fetchOrders()


        const handleOutsideClick = (e) => {
          if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeModal();
          }
        }
      
        if (toggle) {
          document.addEventListener('click', handleOutsideClick);
        } else {
          document.removeEventListener('click', handleOutsideClick);
        }
      
        return () => {
          document.removeEventListener('click', handleOutsideClick);
        };
        
      }, [tableNumber,toggle]);

    useEffect(() => {
        let sum = 0;
        orders.forEach(order => {
            sum += order.item.price;
        });
        setTotal(sum);
    }, [orders]);

    const sendTableNumber = (e: React.MouseEvent<HTMLButtonElement>) => {
        const table = e.currentTarget.value
        getTableNumber(table)
    }

    const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        const table = e.currentTarget.value
        setToggle(true)
        setTableNumber(table)
    }

    const closeModal = () => {
        setToggle(false)
    }

    const closeTables = () => {
        closeTablesUI()
    }


   

    return (
        <div>
            <div className={`flex flex-col items-center ${style}`}>
                {
                    tableButton && (
                        <button onClick={() => closeTables()} className="text-4xl font-bold uppercase text-center m-4 p-4 bg-red-400 hover:bg-red-600 hover:text-white absolute right-0 top-0">x</button>
                    )
                }
                <div className='flex flex-wrap md:w-8/12 lg:w-8/12 justify-center gap-2 m-2'>
                {
                    Array.from({ length: nbOfTables }).map((_, index) => (
                    <div key={index + 1}>
                        <button 
                            onClick={tableButton ? (e) => sendTableNumber(e) : (e) => openModal(e)}
                            className={`${ tables && tables.find(table => table._id == index + 1) ? 'text-white bg-yellow-600' : 'bg-white' } text-xl w-16 font-bold rounded-full p-4 hover:bg-orange-400`} value={index + 1}>
                             {index + 1}
                        </button>
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
                                <p className="text-4xl font-bold uppercase text-center m-4">invoice for table {tableNumber}</p>
                                <button 
                                    name="modal"
                                    onClick={closeModal}
                                    className="text-4xl font-bold uppercase text-center m-4 p-4 bg-red-400 hover:bg-red-600 hover:text-white absolute right-0 top-0"
                                    >x</button>
                            </div>
                            {/* fetch from database the orders */}
                            <div className='w-6/12 max-h-[90%] bg-gray-100 m-auto relative'>
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
                                                orders && orders.length > 0 ? orders.map((detail) => (
                                                    <tr  key={detail._id}>
                                                        <td className='p-4 border-b font-medium'>{detail.item.name}</td>
                                                        <td className='p-4 border-b'>{detail.quantity}</td>
                                                        <td className='p-4 border-b'>{detail.item.price}</td>
                                                        <td className='p-4 border-b font-bold'>{detail.quantity * detail.item.price}</td>
                                                    </tr>
                                                )) 
                                                : 
                                                <tr><td>loading...</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className='uppercase font-medium bg-green-200 w-full sticky z-50 bottom-0 left-0 border-t-4 border-slate-500 p-4'>
                                    <div>Company Name: {COMPANY_NAME}</div>
                                    <div>date of purchase: {date} at {currentTime}</div>
                                    <div>Served by: {staff}</div>
                                    <div className='flex flex-col'>
                                        <div className='flex gap-4 place-content-end'>
                                            <p>subtotal</p>
                                            <p className='font-bold'>${total-(total * 0.15).toFixed(2)}</p>
                                        </div>
                                        <div className='flex gap-4 place-content-end'>
                                            <p>include gst (15%)</p>
                                            <p className='font-bold'>${(total * 0.15).toFixed(2)}</p>
                                        </div>
                                        <div className='flex gap-4 place-content-end'>
                                            <p>total</p>
                                            <p className='font-bold'>${total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col absolute bottom-0 right-0 gap-2 m-3'>
                                <button name="modal" onClick={closeModal} className="text-4xl font-bold uppercase text-center p-4 bg-red-400 hover:bg-red-600 hover:text-white ">close</button>
                                <button className="text-4xl font-bold uppercase text-center p-4 bg-slate-400 hover:bg-slate-600 hover:text-white ">edit</button>
                                <button className="text-4xl font-bold uppercase text-center p-4 bg-slate-400 hover:bg-slate-600 hover:text-white ">print</button>
                                <button className="text-4xl font-bold uppercase text-center p-4 bg-slate-400 hover:bg-slate-600 hover:text-white">pay</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
