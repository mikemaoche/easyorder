import React, { useEffect, useState } from 'react'

type OrderProps = {
    categoryName: String;
}
const Order: React.FC<OrderProps> = ({ categoryName}) => {
  const [items, setItems] = useState();

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
          body: JSON.stringify({ categoryName }),
        });
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

    return (
        <div>
            <div>
              <p className='uppercase font-bold'>Order {categoryName}</p>
              {
                // items.length > 0 ? 
                // items.map((item) => {
                //   return <button>{item}</button>
                // })
                // : <></>
              }
            </div>
        </div>
    )
}

export default Order;