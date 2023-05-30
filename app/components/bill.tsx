import React, { useRef, useEffect, useState } from 'react'
  
export default function bill() {
    const [nbOfTables, setNumbTables] = useState(52)
    const [toggle,setToggle] = useState(false)
    const [tableNumber,setTableNumber] = useState(0)
    const modalRef = useRef(null)
    
    useEffect(() => {
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

    const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        const table = e.currentTarget.value
        setToggle(true)
        setTableNumber(table)
    }

    const closeModal = () => {
        setToggle(false)
    }

    return (
        <div>
            <div className='flex flex-col items-center'>
                <div className='flex flex-wrap md:w-8/12 lg:w-8/12 justify-center gap-2 m-2'>
                {
                    Array.from({ length: nbOfTables }).map((_, index) => (
                    <div key={index + 1}>
                        <button 
                            onClick={(e) => openModal(e)}
                            className="text-xl w-16 font-bold rounded-full bg-white p-4 hover:bg-orange-400" value={index + 1}>
                            {index + 1}
                        </button>
                    </div>
                    ))
                }
                </div>
            </div>
            {/* modal */}
            {
                toggle && (
                    <div className={`fixed inset-0 flex items-center justify-center h-screen `} >
                        <div className='w-11/12 h-[90%] bg-white relative ...' ref={modalRef}>
                            <div className='flex justify-center items-center'>
                                <p className="text-4xl font-bold uppercase text-center m-4">invoice for table {tableNumber}</p>
                                <button 
                                    name="modal"
                                    onClick={closeModal}
                                    className="text-4xl font-bold uppercase text-center m-4 p-4 bg-red-400 hover:bg-red-600 hover:text-white absolute right-0 top-0"
                                    >x</button>
                            </div>
                            {/* fetch from database the orders */}
                            <div className='w-6/12 h-[90%] bg-gray-200 m-auto overflow-y-auto relative'>
                                <div>

                                </div>
                                <div className='uppercase font-bold bg-red-400 w-full absolute z-50 bottom-0 left-0 border-t-4 border-slate-500 p-4'>
                                    <div className='flex flex-col'>
                                        <div className='flex gap-4 place-content-end'>
                                            <p>subtotal</p>
                                            <p>$ 340</p>
                                        </div>
                                        <div className='flex gap-4 place-content-end'>
                                            <p>include gst (15%)</p>
                                            <p>$ 50</p>
                                        </div>
                                        <div className='flex gap-4 place-content-end'>
                                            <p>total</p>
                                            <p>$ 390</p>
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
