import React, { Component } from 'react'

export default class Review extends Component {
  render() {
    return (
        <div className='bg-white border border-red-400 border-l-8 border-r-0 border-t-0 border-b-0 h-full w-[20%] fixed right-0 top-0'>
                <p className="text-right text-xl uppercase font-bold p-4">order preview</p>
            <div className='w-[98%] h-[80%] mx-auto p-1'>
                <table className='w-full h-full table-fixed border border-2 ...'>
                    <thead>
                        <tr>
                        <th className='border-b p-4'>Items</th>
                        <th className='border-b p-4'>Quantity</th>
                        <th className='border-b p-4'>Delete/Edit</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        <tr className='align-top'>
                            <td className='border-b p-4'>
                               <p className='truncate text-center'>name jwqoeddojojdeowejdodjowjdowqej</p>
                            </td>
                            <td className='border-b p-4'>
                                <p>3</p>
                            </td>
                            <td className='border-b p-4'>
                                <div className='flex gap-2'>
                                    <button className="bg-red-400 hover:bg-red-600 text-sm uppercase font-bold w-full p-2">x</button>
                                    <button className="bg-green-400 hover:bg-green-600 text-sm uppercase font-bold w-full p-2">!</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <p className="text-right text-xl uppercase font-bold p-4">table</p>
                <div className='flex gap-2 flex-row-reverse m-2 border-1'>
                    <button className="bg-slate-400 hover:bg-slate-600 hover:text-white rounded-full text-sm uppercase font-bold p-4">send</button>
                    <button className="bg-slate-400 hover:bg-slate-600 hover:text-white rounded-full text-sm uppercase font-bold p-4">table</button>
                    <button className="bg-red-400 hover:bg-red-600 hover:text-white text-sm uppercase font-bold p-4">clear all</button>
                </div>
            </div>
        </div>
    )
  }
}
