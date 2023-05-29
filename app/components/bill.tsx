import React, { useState } from 'react'

export default function bill() {
    const [nbOfTables, setNumbTables] = useState(52)
    return (
        <div>
            <div className='flex flex-col items-center'>
                <div className='flex flex-wrap md:w-8/12 lg:w-8/12 justify-center gap-2 m-2'>
                {
                    Array.from({ length: nbOfTables }).map((_, index) => (
                    <div key={index + 1}>
                        <button 
                        className="text-xl w-16 font-bold rounded-full bg-white p-4 hover:bg-orange-400">
                            {index + 1}
                        </button>
                    </div>
                    ))
                }
                </div>
            </div>
        </div>
    )
}
