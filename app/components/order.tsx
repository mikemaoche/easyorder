import React, { useEffect, useState } from 'react'

type OrderProps = {
    itemType:  String;
    categoryName: String;
}
const Order: React.FC<OrderProps> = ({ itemType, categoryName}) => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:8000/api/items`
        const response = await fetch(url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemType }),
        });

        setData(await response.json());
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

    return (
        <div>
            <div className='flex flex-col items-center'>
              <p className='uppercase font-bold m-4'>Order {categoryName}</p>
              <div className='uppercase text-center flex flex-wrap md:w-8/12 lg:w-8/12 justify-center gap-2 m-2'>
                  {console.log(data)
                  }
                  {
                      data ? (
                      data.items.map((item) => {
                        if(item.type == 'wines' && categoryName == 'wines')
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                            {item.name}</div>
                        if(item.type == 'brandy' && categoryName == 'brandy cognac' || item.type == 'cognac' && categoryName == 'brandy cognac')
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                          {item.name}</div>
                        if(item.type == 'spirits' && categoryName == 'spirits & liqueurs' || item.type == 'liqueurs' && categoryName == 'spirits & liqueurs')
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                            {item.name}</div>
                        if(item.type == 'beers' && categoryName == 'beers')
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                            {item.name}</div>
                        if(item.type == 'cocktails' && categoryName == 'cocktails' || item.type == 'sparkling cocktails' && categoryName == 'cocktails')
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                            {item.name}</div>
                        if(item.type == 'mocktails' && categoryName == 'mocktails')
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                          {item.name}</div>
                        if(item.type == 'soft drinks' && categoryName == 'soft drinks')
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                            {item.name}</div>
                        if(item.type == 'desserts' && categoryName == 'desserts')
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                            {item.name}</div>
                        if(item.type == 'coffees' && categoryName == 'tea & coffees')
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                            {item.name}</div>
                        if(item.category_id == 'food' && (categoryName == 'dinne in' || categoryName == 'takeaway'))
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                            {item.name}</div>
                        if(item.category_id == 'food' && categoryName == 'kids menu')
                          return <div key={item._id} className='bg-white p-4 w-[200px]'>
                            {item.name}</div>
                      })
                    ) : (
                      <div>loading ...</div>
                    )
                  }
              </div>
            </div>
        </div>
    )
}

export default Order;