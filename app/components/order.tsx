import React, { useEffect, useState } from 'react'

type OrderProps = {
    categoryName: String;
}
const Order: React.FC<OrderProps> = ({ categoryName}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/items');
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
            order {categoryName}
            {
              console.table(items)
            }
        </div>
    )
}

export default Order;