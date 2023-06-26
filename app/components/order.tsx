import React, { useEffect, useState } from 'react'
import Review from './review-order'

// key : value
const typeDrinkColorMap: Record<string, string>  = {
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
type Item = {
  id: number;
  name: string;
  quantity: number;
  category_id : string;
  readable : string;
  decafe? : boolean;
};

type OrderProps = {
    itemType:  String;
    categoryName: string;
}

interface DataItem {
  items: any[]; // Replace 'any' with the actual type of the items array
}

const Order: React.FC<OrderProps> = ({ itemType, categoryName}) => {
  const [data, setData] = useState<DataItem>({ items: [] });
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [toggleFlash, setToggleFlash] = useState<boolean>(false)
  const [idToggle, setIdToggle] = useState<number>(0)

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
        let data = await response.json()
        setData(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if(data.items.length == 0) fetchData();
  }, [data]);

  useEffect(() => {
    sortTableRows()
  
  }, [selectedItems])
  
  const addCoffeeField = (itemName : string) => {
    if(itemName == 'cappucino' || itemName == 'latte' || itemName == 'flat white') return false
    if(itemName == 'long black' || itemName == 'macchiato') return false
    if(itemName == 'mocchaccino' || itemName == 'iced coffee' || itemName == 'special coffees') return false
    return undefined
  }

  const addItem = (itemId : number,itemName : string,category_id : string) => {
    let decafe = addCoffeeField(itemName.toLowerCase())
    let newItem: Item = { id: itemId, name: itemName, quantity : 1, category_id , readable : 'editable', decafe, };
    const existingItem = selectedItems.find(item => item.id === itemId);
    if(existingItem){
        // Generate a unique identifier for the new item
        const uniqueId = `${itemId}_${Date.now()}`;
        newItem = {
          id: parseInt(uniqueId),
          name: itemName,
          quantity: 1,
          category_id,
          readable : 'editable',
          decafe,
        };

    }
    // Item is not in the array, add it as a new item
    setSelectedItems([...selectedItems, newItem]);
  }

  const sortTableRows = () => {
    selectedItems.sort((a, b) => {
      if (a.readable === 'readonly' && b.readable !== 'readonly') {
        return -1;
      } else if (a.readable !== 'readonly' && b.readable === 'readonly') {
        return 1;  // Move objects that has readonly to top
      } else {
        return 0; // Leave the order unchanged
      }
    });
  }

  const deleteItem = (id : any) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  }

  const editQuantity = (id : any, quantity : number) => {
    const updatedItems = selectedItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity };
      }
      return item;
    });
    setSelectedItems(updatedItems);
  }

  const resetBucketList = () => {
    setSelectedItems([]);
  }
  const { items } = data

    return (
        <div>
            <Review idToggle={idToggle} toggleFlash={toggleFlash} categoryName={categoryName}
              resetBucketList={resetBucketList} deleteSelectedItem={deleteItem} editQuantity={editQuantity} selectedItems={selectedItems} setSelectedItems={setSelectedItems}
              />
            <div className='flex flex-col xl:items-center'>
              <p className='text-white sm:text-xl md:text-2xl lg:text-4xl uppercase font-bold m-4'>{categoryName}</p>
              <div className='uppercase text-center select-none flex flex-wrap 
              md:w-4/12 lg:w-6/12 justify-center gap-2 m-2 
              overflow-y-auto max-h-[500px] scroll-smooth '>
                  {
                      items.length > 0 ? (
                      items.map((item: { type: string; _id: number; drink_type: { name: string; }; name: any; category_id: string; }) => {
                        if(item.type == 'wines' && categoryName == 'wines')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.drink_type.name]}`}>
                           {item.name}</div>
                        if(item.type == 'brandy' && categoryName == 'brandy cognac' || item.type == 'cognac' && categoryName == 'brandy cognac')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                         {item.name}</div>
                        if(item.type == 'spirits' && categoryName == 'spirits & liqueurs' || item.type == 'liqueurs' && categoryName == 'spirits & liqueurs')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                           {item.name}</div>
                        if(item.type == 'beers' && categoryName == 'beers')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                           {item.name}</div>
                        if(item.type == 'cocktails' && categoryName == 'cocktails' || item.type == 'sparkling cocktails' && categoryName == 'cocktails')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                           {item.name}</div>
                        if(item.type == 'mocktails' && categoryName == 'mocktails')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                         {item.name}</div>
                        if(item.type == 'soft drinks' && categoryName == 'soft drinks')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                           {item.name}</div>
                        if(item.type == 'dessert wines' && categoryName == 'port & dessert wines')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.drink_type.name]}`}>
                           {item.name}</div>
                        if(item.type == 'desserts' && categoryName == 'desserts')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                           {item.name}</div>
                        if((item.type == 'tea' || item.type == 'coffees') && categoryName == 'tea & coffees')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                           {item.name}</div>
                        if(item.category_id == 'food' && (categoryName == 'dinne in' || categoryName == 'takeaway'))
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer ${typeDrinkColorMap[item.type]}`}>
                           {item.name}</div>
                        if((item.category_id == 'food' || item.category_id == 'desserts') && item && categoryName == 'kids menu')
                          return <div role='button' onClick={() => addItem(item._id,item.name,item.category_id)} key={item._id} className={`bg-white p-4 w-[250px] h-[80px] flex items-center text-center justify-center hover:bg-orange-500 cursor-pointer`}>
                           {item.name}</div>
                      })
                    ) : (
                      <div className='text-white uppercase font-bold text-2xl text-center p-2'>loading ...</div>
                    )
                  }
              </div>
            </div>
        </div>
    )
}

export default Order;