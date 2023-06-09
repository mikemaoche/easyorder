import React, { useEffect, useState } from 'react'

type TransactionProps = {
    payMethod : boolean, 
    setPayMethod : (value : boolean | null) => void, 
    setTablePaid : (value : boolean) => void,
    total : number, 
    tableNumber : string | number, 
    setNotify: (value: any) => void;
}
export default function transaction({payMethod, setPayMethod, setTablePaid, total, tableNumber, setNotify} : TransactionProps ) {
    const [amountLeft, setAmountLeft] = useState<number>(total)
    const [currentAmount, setCurrentAmount] = useState<string>('0')
    const [flash, setFlash] = useState<boolean>(false)

    useEffect(() => {
        if(amountLeft <= 0) closeBill()
        const timeout = setTimeout(() =>{
            setFlash(false)
        },3000)
        return () => {
            clearTimeout(timeout);
        };
    },[amountLeft, payMethod, flash])

    useEffect(() =>{
        fetchAmountLeft()
    }, [])

    const cancelPayment = () => {
        if(amountLeft > 0 && amountLeft != total) {
            updateBill()
        } else if(amountLeft == total) {
            setPayMethod(null)
        }
    }

    const closeBill = () => {
        updateBill()
    }

    const fetchAmountLeft = async () => {
        try {
            const url = `http://localhost:8000/api/transactions/fetchOneAmountLeft`
            const response = await fetch(url,
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tableNumber }),
            });
            const { amountLeft, message } = await response.json()
            if(amountLeft) {
                setAmountLeft(amountLeft.$numberDecimal.toString())
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const updateBill = async () => {
        try {
            const url = `http://localhost:8000/api/transactions/updateTableInvoice`
            const response = await fetch(url,
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tableNumber, amountLeft }),
            });
            const { pay, color, message } = await response.json()
            setNotify({state:true, color, message })
            setPayMethod(null)
            setTablePaid(pay)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const payBill = () => {
        const substract = amountLeft - parseFloat(currentAmount)
        setFlash(true)
        setAmountLeft(Number(substract.toFixed(2)));
    }

    const handleInputs = (e: any) => {
        let oldVal : string = currentAmount.toString()
        let value : string = e.target.value
        let updatedValue: string = oldVal
        updatedValue = oldVal + value


        // exceed amount of total then set total
        if(parseFloat(updatedValue) >= parseFloat(amountLeft.toString())) updatedValue = amountLeft.toString()

        // delete digits
        if(value == '<-') updatedValue = oldVal.slice(0, oldVal.length-1)

        // remove the zero on the front
        updatedValue = updatedValue.replace(/(?<!\d)0+(?=[1-9])/, '')

        // Limit to two decimal
        let decimalPart = updatedValue.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
            decimalPart = decimalPart.slice(0, 2);
            updatedValue = updatedValue.split('.')[0] + '.' + decimalPart;
        }

        const dotCount = updatedValue.split('.').length - 1;
        if (dotCount > 1) {
            const parts = updatedValue.split('.');
            updatedValue = parts.shift() + '.' + parts.join('');
            
        }
        
        if(updatedValue == '') updatedValue = '0'
        
        
        setCurrentAmount(updatedValue)
    }
    
    return (
        <div>
            <div className='flex flex-col font-bold bg-slate-600 p-4'>
                <p className='font-bold text-4xl text-green-400'>transaction by {payMethod}</p>
                <div className='w-6/12 mx-auto my-4 text-right text-xl m-2 text-white'>
                    <p>table no {tableNumber ? tableNumber : null}</p>
                    <p>total $ {total ? total.toFixed(2) : 'null'}</p>
                    <p>amount unpaid <span className={`${flash ? 'text-rose-500 transition-all delay-1000 duration-500 ease-out ': null}`}>$ {amountLeft ? amountLeft : null}</span></p>
                </div>
                <div className='bg-white w-6/12 m-auto p-2'>
                    <p>current amount</p>
                    <div className='flex justify-between text-4xl'>
                        <p>$</p>
                        <p>{currentAmount.toString()}</p>
                    </div>
                </div>
                <div className='w-4/12 m-auto flex flex-wrap gap-2 p-4 m-2 text-right'>
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="1" />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="2" />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="3" />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="4" />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="5" />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="6" />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="7" />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="8" />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="9" />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="." />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="0" />
                    <input onClick={(e) => handleInputs(e)} type="button" className='w-20 h-20 border border-green-100 border-4 bg-white hover:bg-green-300 active:bg-blue-400 active:text-white' value="<-" />
                </div>
                <div className='flex flex-row-reverse gap-2 m-2'>
                    <button onClick={() => payBill()} className='w-[100px] h-[100px] bg-emerald-400 hover:text-white hover:bg-emerald-500'>pay</button>
                    <button onClick={() => cancelPayment()} className='w-[100px] h-[100px] bg-red-400 hover:text-white hover:bg-red-500'>cancel</button>
                </div>
            </div>
        </div>
    )
}
