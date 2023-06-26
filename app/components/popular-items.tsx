import React, { useEffect, useState } from 'react'

interface PopularItem {
  _id: string;
  name: string;
  quantitySold: number;
  // Add more properties if necessary
}

export default function Popularity() {
  
  const [popular, setPopular] = useState<PopularItem[]>([])
  const gold = {
    borderColor: 'border-yellow-500',
    fontColor: 'text-yellow-600',
    bg: 'bg-yellow-200'
  }
  const silver = {
    borderColor: 'border-gray-400',
    fontColor: 'text-slate-700',
    bg: 'bg-slate-200'
  }

  const bronze = {
    borderColor: 'border-amber-600',
    fontColor: 'text-yellow-700',
    bg: 'bg-amber-700'
  }
  useEffect(() => {
    fetchPopularItems()
  }, [])

  const fetchPopularItems = async () => {
    try {
      const url = `http://localhost:8000/api/items/getPopularItems`
      const response = await fetch(url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      const { popular, message } = await response.json()
      setPopular(popular)
    } catch (error) {
        console.error('Error:', error);
    }
  }
  
  return (
    <div className='w-6/12 absolute top-10 p-4'>
      <div className='my-4 text-center'>
        <p className='text-4xl uppercase text-white'>our top sellers !!!</p>
      </div>
      <div className='flex flex-col items-center space-y-2'>
        {
          popular && popular.length > 0 ? 
          (
            popular.map((item, index) => {
              let color = null;
              let rank = index + 1
              if(rank === 1) color = gold
              if(rank === 2) color = silver
              if (rank === 3) color = bronze
              let id = item._id
              let name = item.name
              let quantity = item.quantitySold
              return (
                <div key={`${id}_${rank.toString()}`} className={`${color?.bg} ${color?.borderColor} ${color?.fontColor} w-full bg-white border border-4 hover:border-green-400 hover:bg-green-100 hover:text-green-600 text-center p-4 uppercase`} role='button'>
                  <div className={`flex ${rank === 1 ? 'items-center' : null} justify-between`}>
                    <p>rank. {rank}{rank === 1 ?  <img className='w-20 h-20' src="./images/crown.png" alt="" />: null }</p> 
                    <p><span className='font-bold'>{name} </span>[qt sold: <span className='font-bold'>{quantity}</span>]</p>
                  </div>
                </div>
              )
            }

              
            )
          )
          : (
            <div>no data</div>
          )
        }
      </div>
    </div>
  )
}
