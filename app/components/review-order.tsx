import React, { useEffect, useState } from 'react'
import EditOrder from './edit-order'
import Table from './bill'

export default function Review({ itemType, idToggle, toggleFlash, resetBucketList, deleteSelectedItem, editQuantity, selectedItems}){
    const TABLE_STYLE = 'fixed top-20 left-0 right-0 bottom-20 m-auto z-10 bg-emerald-400 w-6/12 p-4 border-4 justify-center'
    const table = 'unselected'
    const [canSend, setCanSend] = useState(true)
    const [tableNumb, setTableNumb] = useState(table)
    const [flash, setFlash] = useState(false);
    const [isEditOrderOn, setIsEditOrderOn] = useState(false)
    const [itemId, setItemId] = useState(null)
    const [extend, setExtend] = useState(false)
    const [tableButton, setTableButton] = useState(false)
    const [clearButton, setClearButton] = useState(true)

    useEffect(() => {
        // check if there is a table number and an item before sending
        const disableClearButton = () => {
            setClearButton(!(selectedItems.length > 0 || tableNumb != table))
        }
        disableClearButton()

        const verifyOrder = () => {
            let decision = false
            if(tableNumb == table && selectedItems.length <= 0)  decision = true;
            if(tableNumb == table && selectedItems.length >= 0) decision = true;
            if(selectedItems.length <= 0 && tableNumb != table) decision = true;
            setCanSend(decision)
        }
        verifyOrder()

        if (toggleFlash) {
          setFlash(true);
        }

        // if(tableNumb != table) fetchOrders()
    }, [toggleFlash, selectedItems, tableNumb]);

    const fetchOrders = async () => {
        try {
            const url = `http://localhost:8000/api/items/fetchOrders`
            const response = await fetch(url,
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tableId : tableNumb }),
            });
            const { orders, message } = await response.json()
            if(orders) {
                
                orders.map((order) =>{
                    // selectedItems.item.id = order._id
                    // selectedItems.item.name = order.item.name
                    // selectedItems.item.quantity = order.quantity
                })
            }
            // console.log(selectedItems);
            
            } catch (error) {
            console.error('Error:', error);
        }
    }

    const clearAll = () => {
        setCanSend(true)
        setTableNumb(table)
        resetBucketList()
    }
    const removeItem = (id: any) => {
        deleteSelectedItem(id)
    }

    const handleChange = (id: any, e: React.ChangeEvent<HTMLInputElement>) => {
        let quantity = parseInt(e.target.value);
        editQuantity(id, quantity);
    }

    const editItem = (id: any) => {
        setItemId(id)
        setIsEditOrderOn(true)
    }

    const setEditToggle = (status) => {
        setIsEditOrderOn(status)
    }

    const extendTable = () => {
        let temp = !extend
        setExtend(temp)
    }
    const getTable = (tableNO) => {
        setTableNumb(tableNO)
    }
    
    const openTablesUI = () => {
        setTableButton(true)
    }

    const closeTablesUI = () => {
        setTableButton(false)
    }

    const sendOrder =  () => {
        const registerOrder = async () => {
            console.log('send order', selectedItems);
            
            try {
              const url = `http://localhost:8000/api/items/sendOrder`
              const response = await fetch(url,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tableNumb, selectedItems }),
              });
              
            } catch (error) {
              console.error('Error:', error);
            }
        }
        registerOrder()
    }

    return (
        <div>
            <div className={`bg-white border border-red-400 border-l-8 border-r-0 border-t-0 border-b-0 h-full ${ extend ? 'xl:w-[80%] w-[90%]' : 'xl:w-[20%] w-[30%]' } transition-all fixed right-0 top-0`}>
                    <button onClick={() => extendTable()} className="text-white bg-red-400 font-bold w-14 p-4 absolute top-[40%] -left-8 rounded-full hover:bg-red-600">{ extend ? '>' :  '<' } </button>
                    <p className="text-right text-xl uppercase font-bold p-4">order preview</p>
                <div className='w-[98%] h-[80%] m-auto p-1'>
                    <table className='w-full table-fixed border border-2 ...'>
                        <thead  className='sticky top-0 bg-white'>
                            <tr>
                            <th className='border-b p-4'>Items</th>
                            <th className='border-b p-4'>Quantity</th>
                            <th className='border-b p-4'>Delete/Edit</th>
                            </tr>
                        </thead>
                    </table>
                    <div className='w-full max-h-[90%] sm:max-h-[700px] overflow-y-auto'>
                        <table className='w-full table-fixed text-center'>
                            <tbody className=''>
                                {
                                    selectedItems.length > 0 ? 
                                    selectedItems.map((item) => {
                                        return (
                                                <tr key={item.name} className='align-top'>
                                                    <td className='border-b border-l p-4'>
                                                    <p className='truncate text-center'>{item.name}</p>
                                                    </td>
                                                    <td className='border-b p-4'>
                                                        <input type="number"  name="quantity" min="1" max="999" onChange={(e) => handleChange(item.id, e)}  className={`border w-16 text-right transition-colors duration-500  ${item.id == idToggle && flash ? 'border-green-400 font-black' : 'border-gray-300'}`} value={item.quantity} />
                                                    </td>
                                                    <td className='border-b p-4'>
                                                        <div className='flex gap-2'>
                                                            <button onClick={() => removeItem(item.id)} className="bg-red-400 hover:bg-red-600 hover:text-white text-sm uppercase font-bold w-full p-2">x</button>
                                                            <button onClick={() => editItem(item.id)} className="bg-green-400 hover:bg-green-600 hover:text-white text-sm uppercase font-bold w-full p-2">!</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                        )
                                    }) : (<></>)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <p className="text-right text-xl uppercase font-bold p-4">table {tableNumb}</p>
                    <div className='flex gap-2 flex-row-reverse m-2 border-1'>
                        <button onClick={() => sendOrder()} disabled={canSend} className={`${canSend?  'disabled:opacity-70 cursor-no-drop' : 'hover:bg-slate-600 hover:text-white' } bg-slate-400 rounded-full text-sm uppercase font-bold p-4`}>send</button>
                        <button onClick={() => openTablesUI()} disabled={tableButton} className={`${tableButton?  'disabled:opacity-70 cursor-no-drop' : 'hover:bg-slate-600 hover:text-white' } bg-slate-400 rounded-full text-sm uppercase font-bold p-4`}>table</button>
                        <button onClick={clearAll} disabled={clearButton} className={`${clearButton ? 'disabled:opacity-70 cursor-no-drop' : 'hover:bg-red-600 hover:text-white'} bg-red-400 text-sm uppercase font-bold p-4`} >clear all</button>
                    </div>
                </div>
            </div>
            {
                isEditOrderOn && (
                    <EditOrder itemId={itemId} itemType={itemType} setEditToggle={setEditToggle} />
                )
            }
            {
                tableButton && (
                    <Table style={TABLE_STYLE} tableButton={tableButton} closeTablesUI={closeTablesUI} getTableNumber={getTable}/> 
                )
            }
            
        </div>
    )
  
}
