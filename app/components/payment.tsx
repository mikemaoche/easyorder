import React, { useEffect, useState } from 'react'
import Transaction from './transaction'
import Notification from './notification'

export default function payment({ setNotifyBill, setTogglePayment, total, tableNumber, isTablePaid, setTablePaid}) {
    const [payMethod, setPayMethod] = useState(null)
    const [notify,setNotify] = useState({state:false, color:'', message:''})

    useEffect(() => {
        if(isTablePaid) setNotifyBill(notify)
    },[notify])
    
    const closeWindow = () =>{
        setTogglePayment(false)
    }

    const choosePayment = (e) => {
        let text = e.target.innerText.toLowerCase()
        setPayMethod(text)
    }

    return (
        <div>
            <div className='w-full bg-slate-400 inset-0 absolute z-50 flex items-center justify-center uppercase'>
                {
                    payMethod == null && (
                    <div className='font-bold'>
                        <button onClick={(e) => choosePayment(e)} className='uppercase w-[200px] h-[200px] bg-green-200 m-2 hover:bg-green-500 hover:text-white'>cash</button>
                        <button onClick={(e) => choosePayment(e)} className='uppercase w-[200px] h-[200px] bg-gray-100 m-2 hover:bg-green-500 hover:text-white'>eftpos</button>
                        <button onClick={() => closeWindow()} className='uppercase w-[200px] h-[200px] bg-red-200 m-2 hover:bg-red-500 hover:text-white'>cancel payment</button>
                    </div>
                    )
                }
                {
                    payMethod && (
                        <Transaction payMethod={payMethod} setPayMethod={setPayMethod} setTablePaid={setTablePaid} total={total} tableNumber={tableNumber} setNotify={setNotify}/>
                    )
                }
                {
                    !isTablePaid && notify.color == 'orange' ? <Notification notify={notify} setNotify={setNotify} duration={Math.max(notify.message.length * 70, 2000)} /> : null
                }
            </div>

        </div>
    )
}
