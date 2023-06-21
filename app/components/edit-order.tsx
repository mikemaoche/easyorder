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

const EditOrder: React.FC<Props>  = ({itemId, categoryName, productName, setEditToggle , selectedItems, setSelectedItems}) => {
    const [data,setData] = useState(null)
    const [takeaway, setTakeaway] = useState(categoryName == 'takeaway' ? true : false)
    const [note, setNote] = useState("")
    const [alcohol, setAlcohol] = useState(false)
    const [decaf, setDecaf] = useState(false)
    const [checkboxStates, setCheckboxStates] = useState({
      glass: true
    });
    const [selectedOption, setSelectedOption] = useState('');
    
    useEffect(() => {
        if(itemId != null) {
            const fetchItem = async () => {
                try {
                  const url = `http://localhost:8000/api/items/editOrder`
                  const response = await fetch(url,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId }),
                  });
                  let data = await response.json()
                  const selectedItem = selectedItems.find(item => item.id === itemId);
                  console.log(selectedItem);
                  
                  if (selectedItem) {
                    // update fields
                    setTakeaway(data.item.takeaway? data.item.takeaway : selectedItem.takeaway)
                    setNote(data.item.note? data.item.note : selectedItem.note)
                    setDecaf(data.item.decafe? data.item.decafe : selectedItem.decafe)
                    setAlcohol(data.item.alcohol? data.item.alcohol : selectedItem.alcohol) // affogato
                    setSelectedOption(data.item.selectedOption? data.item.selectedOption : selectedItem.selectedOption) // all other alcohols
                  } 
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

    const handleTakeaways = () => {
      // change only if it's not in takeaway menu
      if(categoryName != 'takeaway') {
        setTakeaway(!takeaway)
      }
    }

    const handleAlcohol= () => {
      setAlcohol(!alcohol)
    }

    const handleDecaf= () => {
      setDecaf(!decaf)
    }

    const handleChecked = (e) => {
      const { name, checked } = e.target
      setCheckboxStates((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    }

    // select box for the spirits
    const handleOptionClick = (option) => {
      console.log(option);
      
      setSelectedOption(option);
    };

    const handleNote = (e) => {
      setNote(e.target.value)
    }


    const saveModifications = () => {
      const itemIndex = selectedItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        const updatedItem = { ...selectedItems[itemIndex] };
        updatedItem.takeaway = takeaway;
        updatedItem.alcohol = alcohol;
        updatedItem.selectedOption = selectedOption;
        updatedItem.decafe = decaf;
        updatedItem.note = note;
        updatedItem.readable = 'editable';
        selectedItems[itemIndex] = updatedItem;
        setSelectedItems(selectedItems);
      }
      closeModal()
    }
    
    return (
        <div className={`fixed inset-0 flex items-center justify-center `} >
            <div className='w-6/12 h-[800px] p-4 m-2 bg-white relative ...'>
                <p className="text-4xl font-bold uppercase text-center my-4">edit {productName}</p>
                <div className='bg-slate-200 w-full h-[499px] max-h-[500px] overflow-y-auto p-2 text-2xl ...'>
                    {
                       data ? (
                        <ul className='w-full m-auto uppercase'>
                          {
                            Object.keys(data).map((key, index) => (
                            <li key={`${key}_${index}`} className='my-4 px-2'>
                              {
                                (key == 'name' || key == 'type' || key == 'country') && (<><strong>{key}: </strong><span>{JSON.stringify(data[key]).replace(/"/g, '')}</span></>) ||
                                key == 'price' && (<><strong>{key}:</strong><span> ${JSON.stringify(data[key].$numberDecimal).replace(/"/g, '')}</span></>) ||
                                key == 'drink_type' && 
                                (
                                  <>
                                    <strong>specific type: </strong><span>{JSON.stringify(data[key].name).replace(/"/g, '')}</span>
                                    <p><strong>served per</strong></p>
                                    {
                                      JSON.parse(JSON.stringify(data[key].served)).map((detail,index) => (
                                          <div key={`${key}_${index}`} className='flex gap-2 items-center'>
                                            <input onChange={(e) => handleChecked(e)} name={detail.type} className='w-20 h-20 my-2' type="checkbox" checked={checkboxStates[detail.type]}/>
                                            <p>{detail.type} (${detail.price.$numberDecimal})</p>
                                          </div>
                                        )
                                      )
                                    }
                                  </>
                                ) ||
                                (key == 'takeaway') && 
                                (
                                  <div className='flex items-center gap-2'>
                                    <strong>{key}: </strong> <input onChange={() => handleTakeaways()} name={key} className='w-20 h-20 my-2' type="checkbox" checked={takeaway}/>
                                  </div>
                                ) ||
                                (key == 'options') && 
                                (
                                  <>
                                    <strong>Can come with:</strong>
                                    {
                                      JSON.parse(JSON.stringify(data[key])).map((option,index) => (
                                            <p key={`${key}_${index}`}>{option}</p>
                                        )
                                      )
                                    }
                                    <p className='text-sm lowercase'><span className='text-red-500 font-bold'>*</span>check menu for more info...</p>
                                  </>
                                ) ||
                                (key == 'popularity_id') && (<><strong>ranking: </strong><span>{JSON.stringify(data[key]).replace(/"/g, '')}</span></>) ||
                                key == 'list' && 
                                (
                                  <>
                                    <p className='uppercase font-bold'>available options: <span className='font-normal lowercase'>(touch one)</span></p>
                                    <div className=''>
                                      {
                                        JSON.parse(JSON.stringify(data[key])).map((spirit,index) => (
                                              <button key={`${spirit.name}_${index}`} className={`px-4 py-2 m-2 rounded text-white uppercase
                                                ${spirit.name === selectedOption ? 'bg-blue-500' : 'bg-gray-400'}`} 
                                                onClick={() => handleOptionClick(spirit.name)}
                                              >
                                                {spirit.name}
                                              </button>
                                          )
                                        )
                                      }
                                    </div>
                                  </>
                                ) ||
                                (key == 'alcohol' || key == 'decafe') && (
                                  <>
                                    <div className='flex items-center gap-2'>
                                      <strong>{key}: </strong> 
                                      <input onChange={key == 'alcohol' ? () => handleAlcohol() : () => handleDecaf()} name={key} className='w-20 h-20 my-2' type="checkbox" checked={key == 'alcohol' ? alcohol : decaf}/>
                                    </div>
                                  </>
                                ) ||
                                key == 'prices' && (
                                  <>
                                    <strong>actual price: </strong><span>$ {data[key][!alcohol ? 0 : 1].$numberDecimal} ({alcohol ? 'with' : 'without'} liqueur)</span>
                                  </>
                                )

                              }
                            </li>
                          ))}
                          <li className='my-4 px-2'>
                            <div className='flex items-center gap-2 '>
                              <label className='font-bold' htmlFor="note">note: </label>
                              <input onChange={(e) => handleNote(e)} className='p-2 w-full' type="text" name="note" id="note" value={note != undefined ? note : ""} placeholder='Write Here...'/>
                            </div>
                          </li>
                        </ul>
                      ) : <div>loading ...</div>
                    }
                </div>
                <div className='absolute w-full left-0 bottom-0 flex flex-col'>
                    <button name="modal" onClick={closeModal} className="text-4xl mx-2 font-bold uppercase text-center p-4 bg-red-400 hover:bg-red-600 hover:text-white ">cancel</button>
                    <button onClick={saveModifications} className="text-4xl m-2 font-bold uppercase text-center p-4 bg-slate-400 hover:bg-slate-600 hover:text-white ">done</button>
                </div>
            </div>
        </div>
    )
  
}

export default EditOrder;