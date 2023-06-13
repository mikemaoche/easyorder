import React, { useEffect, useState } from 'react'

export default function transaction({payMethod, setPayMethod, total, tableNumber}) {
    const [amountLeft, setAmountLeft] = useState(total)
    const [currentAmount, setCurrentAmount] = useState(0)

    useEffect(()=>{
        if(amountLeft == 0) closeBill()
    },[amountLeft])

    const cancelPayment = () => {
        setPayMethod(null)
        if(amountLeft > 0 && amountLeft != total) alert('amount left is saved in the database')
    }

    const closeBill = () => {
        setPayMethod(null)
        alert('table is paid')
    }

    const payBill = () => {
        const substract = amountLeft - currentAmount
        setAmountLeft(substract)
    }

    const handleInputs = (e) => {
        let oldVal = currentAmount.toString()
        let value = e.target.value.toString()
        let updatedValue = oldVal
        
        if(oldVal.startsWith('0') && value == '0') oldVal = ''
        if(oldVal == '' && value == '.') oldVal = '0'

        if(value == '<-') updatedValue = oldVal.slice(0, oldVal.length-1)
        let existingDot = oldVal.indexOf('.')
        
        // not dot found then add a dot
        if(existingDot == -1 && value != '<-') updatedValue = oldVal + value
        if(value != '<-' && value != '.') updatedValue = oldVal + value
        

        // exceed amount of total then set total
        if(updatedValue > amountLeft) updatedValue = amountLeft.toString()
        
        // exceed 2 decimals
        const decimalPart = updatedValue.toString().split(".")[1];
        if(decimalPart && decimalPart.length > 2) {
            updatedValue = oldVal
        }
        
        updatedValue = updatedValue.replace(/(?<!\d)0+(?=[1-9])/, '')

        setCurrentAmount(updatedValue)
    }

    return (
        <div>
            <div className='flex flex-col font-bold bg-slate-600 p-4'>
                <p className='font-bold text-4xl text-green-400'>transaction by {payMethod}</p>
                <div className='w-6/12 mx-auto my-4 text-right text-xl m-2 text-white'>
                    <p>table no {tableNumber}</p>
                    <p>total $ {total.toFixed(2)}</p>
                    <p>amount unpaid $ {amountLeft.toFixed(2)}</p>
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
