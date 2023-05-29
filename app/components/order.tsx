import React, { useEffect, useState } from 'react'
import Review from './review-order'

// key : value
const typeDrinkColorMap = {
  'red wines': 'bg-red-400',
  'white wines': 'bg-slate-200',
  'sparkling wines' : 'bg-cyan-300',
  'sauvignon blanc' : 'bg-slate-400 text-white',
  'pinot gris' : 'bg-gray-900 text-white',
  'pinot noir' : 'bg-red-600 text-white',
  'other reds' : 'bg-red-800 text-white',
  'soft drinks' : 'bg-blue-500 text-white',
  coffees : 'bg-yellow-900 text-white',
  tea : 'bg-green-600 text-white',
  premium : 'bg-yellow-600 text-white',
  chardonnay : 'bg-stone-300',
  champagne : 'bg-yellow-400',
  rose : 'bg-rose-300',
  desserts :'bg-amber-400',
  port :'bg-red-700 text-white',
  brandy :'bg-teal-500 text-white',
  cognac :'bg-emerald-500 text-white',
  liqueurs :'bg-violet-500 text-white',
  spirits :'bg-lime-500 text-white',
  beers :'bg-amber-500 text-white',
  cocktails :'bg-pink-700 text-white',
  mocktails :'bg-emerald-700 text-white',
  'sparkling cocktails':'bg-sky-700 text-white',
  pizza :'bg-red-600 text-white',
  bread : 'bg-orange-100',
  'cold appetisers' : 'bg-blue-400',
  'hot appetisers' : 'bg-red-400',
  salads :'bg-green-200',
  side : 'bg-purple-200',
  pasta : 'bg-yellow-400',
  'oven pasta' : 'bg-yellow-600',
  risotto : 'bg-amber-600 text-white',
  other : 'bg-emerald-600 text-white'
  
  // Add more type_drink-color mappings as needed
};

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
            <Review />
            <div className='flex flex-col items-center'>
              <p className='text-white sm:text-xl md:text-2xl lg:text-4xl uppercase font-bold m-4'>{categoryName}</p>
              <div className='uppercase text-center flex flex-wrap md:w-8/12 lg:w-8/12 justify-center gap-2 m-2'>
                  {
                      data ? (
                      data.items.map((item: { type: string; _id: React.Key | null | undefined; drink_type: { name: string | number; }; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.PromiseLikeOfReactNode | null | undefined; category_id: string; }) => {
                        if(item.type == 'wines' && categoryName == 'wines')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.drink_type.name]}`}>
                            {item.name}</div>
                        if(item.type == 'brandy' && categoryName == 'brandy cognac' || item.type == 'cognac' && categoryName == 'brandy cognac')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                          {item.name}</div>
                        if(item.type == 'spirits' && categoryName == 'spirits & liqueurs' || item.type == 'liqueurs' && categoryName == 'spirits & liqueurs')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                            {item.name}</div>
                        if(item.type == 'beers' && categoryName == 'beers')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                            {item.name}</div>
                        if(item.type == 'cocktails' && categoryName == 'cocktails' || item.type == 'sparkling cocktails' && categoryName == 'cocktails')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                            {item.name}</div>
                        if(item.type == 'mocktails' && categoryName == 'mocktails')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                          {item.name}</div>
                        if(item.type == 'soft drinks' && categoryName == 'soft drinks')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                            {item.name}</div>
                        if(item.type == 'dessert wines' && categoryName == 'port & dessert wines')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.drink_type.name]}`}>
                            {item.name}</div>
                        if(item.type == 'desserts' && categoryName == 'desserts')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                            {item.name}</div>
                        if((item.type == 'tea' || item.type == 'coffees') && categoryName == 'tea & coffees')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                            {item.name}</div>
                        if(item.category_id == 'food' && (categoryName == 'dinne in' || categoryName == 'takeaway'))
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                            {item.name}</div>
                        if(item.category_id == 'food' && categoryName == 'kids menu')
                          return <div key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer`}>
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