const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();

const { connectToDatabase, closeDatabaseConnection } = require('../server');

// Get all items for the category
router.post('/', async (req, res) => {
  try {
    const { itemType } = req.body;
    let db = await connectToDatabase();
    const collection = db.collection(itemType); 
    const items = await collection.find({}).toArray();
    if(items.length > 0) res.status(200).json({ items, message: 'Items are fetched successfully' });
    else res.status(200).json({ items : [], message: 'No items are fetched successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch items from MongoDB' });
  } finally {
    await closeDatabaseConnection();
  }
});

router.post('/editOrder', async (req, res) => {
  try {
    const { itemId } = req.body;
    let db = await connectToDatabase();
    const collections = await db.listCollections().toArray();
    const searchQuery = { _id : new ObjectId(itemId) }; 
    let item = null;
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      item = await collection.findOne(searchQuery);
      if (item) {
        res.status(200).json({ item, message: `the product ${itemId} is fetched` });
        break;
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: `Failed to fetch the item from MongoDB` });
  } finally {
    await closeDatabaseConnection();
  }
})


// need table number, its order, and quantity
router.post('/sendOrder', async (req, res) => {
  try {
    const { tableNumber, selectedItems } = req.body;
    let _id = parseInt(tableNumber);
    let db = await connectToDatabase();

    // register table
    const tables = db.collection('tables');
    if (tables.length === 0) {
      await database.createCollection('tables');
    }
    if(!await tables.findOne({ _id })) {
      await tables.insertOne({ _id  });
    }
    

    // register order
    const orders = db.collection('orders');
    if (orders.length === 0) {
      await database.createCollection('orders');
    }
    for (const { id, name , quantity, category_id } of selectedItems) {
      const existingOrder = await orders.findOne({ 'item.id': id, table_id: _id });
      if(existingOrder) {
        await orders.updateOne({ 'item.id': id, table_id: _id },
        { $set: { quantity: existingOrder.quantity + quantity } })
      } else {
        await orders.insertOne({ item : { id , name, category_id } , quantity, table_id : _id });
      }
    }
    res.status(200).json({ message: `The order is sent to the table ${tableNumber}!` });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: `Failed to send order to MongoDB` });
  } finally {
    await closeDatabaseConnection();
  }
})


router.get('/fetchTables', async (req, res) => {
  try {
    let db = await connectToDatabase();
    const collection = db.collection('tables'); 
    if (collection.length === 0) {
      await database.createCollection('tables');
    }
    const tables = await collection.find().toArray();
    res.status(200).json({ tables, message: 'Orders are fetched successfully' });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch tables with their orders from MongoDB' });
  } finally {
    await closeDatabaseConnection();
  }
});


router.post('/fetchOrders', async (req, res) => {
  try {
    const { tableId } = req.body;
    let db = await connectToDatabase();
    const tables = db.collection('tables');
    if (tables.length === 0) {
      await database.createCollection('tables');
    } 
    const foundTable = tables.findOne({ _id: tableId });
    if(foundTable !== null) {
      // order without price
      const collect = db.collection('orders'); 
      const orders = await collect.find({ table_id: parseInt(tableId) }).toArray();


      const itemIds = orders.flatMap(order => order.item.id);
      // convert to ObjectId
      const objectIdArray = itemIds.map(itemId => new ObjectId(itemId));
      for (const order of orders) {
        const dynamicCollection = db.collection(order.item.category_id);
        const itemDetails = await dynamicCollection.find({ _id : { $in: objectIdArray } }).toArray();
        
        if(itemDetails) {
          itemDetails.map((item) => {
              order.item.price = item.price ? parseFloat(item.price.toString()) : item.drink_type ? parseFloat(item.drink_type.served[0].price.toString()) : null;
              order.item.takeaway = item.takeaway;
          })
        }
      }
      res.status(200).json({ orders, message: `the order is fetched from ${tableId}` });
    } else {
      throw new Error('Table not found');
    }
    

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: `Failed to fetch the order from MongoDB` });
  } finally {
    await closeDatabaseConnection();
  }
})

// const orders = db.collection('orders');

// orders.aggregate([
//   {
//     $group: {
//       _id: '$orderItem',
//       totalQuantity: { $sum: '$quantity' }
//     }
//   },
//   { $sort: { totalQuantity: -1 } },
//   { $limit: 10 }
// ]).toArray(function (err, result) {
//   if (err) {
//     console.error('Error fetching popular items:', err);
//     return;
//   }

//   console.log('Popular items:', result);
// });

module.exports = router;