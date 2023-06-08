import React, { useState, useEffect, useRef } from 'react'

interface Item {
    _id: ObjectId;
    name: string;
    price: number | { $numberDecimal: string };
    category_id: string;
    type: string;
    takeaway: boolean;
  }
  
interface Props {
itemId: string;
}

const EditOrder: React.FC<Props>  = ({itemId, itemType, setEditToggle}) => {
    const [data,setData] = useState(null)

    useEffect(() => {
        if(itemId != null) {
            const fetchItem = async () => {
                try {
                    console.log(itemId);
                
                  const url = `http://localhost:8000/api/items/editOrder`
                  const response = await fetch(url,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId, itemType }),
                  });
                  let data = await response.json()
                  setData(data.item);
                } catch (error) {
                  console.error('Error:', error);
                }
              }
              fetchItem()
        } else{
            alert('error when trying to edit this item')
            closeModal()
        }


      }, []);

    const closeModal = () => {
        setEditToggle(false)
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center h-screen `} >
            <div className='w-[98%] h-[98%] bg-white relative ...'>
                <div className='flex justify-center items-center'>
                    <p className="text-4xl font-bold uppercase text-center m-4">edit {itemId}</p>
                    <button 
                        name="modal"
                        onClick={closeModal}
                        className="text-4xl font-bold uppercase text-center m-4 p-4 bg-red-400 hover:bg-red-600 hover:text-white absolute right-0 top-0"
                        >x</button>
                </div>
                <div className='bg-slate-200 w-7/12 h-[90%] m-auto'>
                    {
                       console.log(data)
                    }
                    {
                       data ? (
                        <ul>
                          {Object.keys(data).map((key) => (
                            <li key={key}>
                              <strong>{key}:</strong> {JSON.stringify(data[key])}
                            </li>
                          ))}
                        </ul>
                      ) : <div>loading ...</div>
                    }
                </div>
                <div className='flex flex-col absolute bottom-0 right-0 gap-2 m-3'>
                    <button name="modal" onClick={closeModal} className="text-4xl font-bold uppercase text-center p-4 bg-red-400 hover:bg-red-600 hover:text-white ">cancel</button>
                    <button className="text-4xl font-bold uppercase text-center p-4 bg-slate-400 hover:bg-slate-600 hover:text-white ">save</button>
                </div>
            </div>
        </div>
    )
  
}

export default EditOrder;