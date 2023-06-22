import React from 'react'

export default function Popularity() {
  return (
    <div>
      <div className='m-4'>
        <p className='text-4xl uppercase text-white'>ranking system of our products</p>
      </div>
      <div className='flex items-center'>
        <div className={`w-full bg-white border border-4 hover:bg-green-200 text-center p-2 uppercase`} role='button'>
          <div className='flex justify-between'>
            <p>rank. {1}</p> 
            <p>product</p>
          </div>
        </div>
      </div>
    </div>
  )
}
