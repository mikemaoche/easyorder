import React, { useEffect, useState } from 'react'


export default function Review({idToggle, toggleFlash, resetBucketList, deleteSelectedItem, editQuantity, selectedItems}){
    
    const table = 'unselected'
    const [canSend, setCanSend] = useState(true)
    const [tableNumb, setTableNumb] = useState(table)
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        if (toggleFlash) {
          setFlash(true);
        }
    }, [toggleFlash]);

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
    };

    return (
        <div className='bg-white border border-red-400 border-l-8 border-r-0 border-t-0 border-b-0 h-full w-[20%] fixed right-0 top-0'>
                <p className="text-right text-xl uppercase font-bold p-4">order preview</p>
            <div className='w-[98%] h-[80%] mx-auto p-1 overflow-y-auto'>
                <table className='w-full h-full table-fixed border border-2 ...'>
                    <thead  className='sticky -top-2 bg-white'>
                        <tr>
                        <th className='border-b p-4'>Items</th>
                        <th className='border-b p-4'>Quantity</th>
                        <th className='border-b p-4'>Delete/Edit</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {
                            selectedItems.length > 0 ? 
                            selectedItems.map((item) => {
                                return (
                                        <tr key={item.name} className='align-top'>
                                            <td className='border-b p-4'>
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
            <div>
                <p className="text-right text-xl uppercase font-bold p-4">table {tableNumb}</p>
                <div className='flex gap-2 flex-row-reverse m-2 border-1'>
                    <button disabled={canSend} className={`${canSend?  'disabled:opacity-70 cursor-no-drop' : 'hover:bg-slate-600 hover:text-white' } bg-slate-400 rounded-full text-sm uppercase font-bold p-4`}>send</button>
                    <button className="bg-slate-400 hover:bg-slate-600 hover:text-white rounded-full text-sm uppercase font-bold p-4">table</button>
                    <button onClick={clearAll} className="bg-red-400 hover:bg-red-600 hover:text-white text-sm uppercase font-bold p-4">clear all</button>
                </div>
            </div>
        </div>
    )
  
}
