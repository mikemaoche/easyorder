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
    res.status(200).json({ items, message: 'Items are fetched successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch items from MongoDB' });
  } finally {
    await closeDatabaseConnection();
  }
});

router.post('/editOrder', async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    let db = await connectToDatabase();
    const collection = db.collection(itemType); 
    const item = await collection.findOne({ _id: new ObjectId(itemId) });
    console.log(item);
    res.status(200).json({ item, message: `the product ${itemId} is fetched` });
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
    const { tableNumb, selectedItems } = req.body;
    let _id = parseInt(tableNumb);
    let status = 'open';
    let db = await connectToDatabase();

    // register table
    const tables = db.collection('tables');
    if(!await tables.findOne({ _id })) {
      await tables.insertOne({ _id , status });
    }

    // register order
    const order = db.collection('orders');
    for (const { id, name , quantity, category_id } of selectedItems) {
      const existingOrder = await order.findOne({ 'item.id': id, table_id: _id });
      if(existingOrder) {
        await order.updateOne({ 'item.id': id, table_id: _id },
        { $set: { quantity: existingOrder.quantity + quantity } })
      } else {
        await order.insertOne({ item : { id , name, category_id } , quantity, table_id : _id });
      }
    }

    res.status(200).json({ message: `The order is sent to the table ${tableNumb}!` });
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
    const tables = await collection.find({status: 'open'}).toArray();
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
    const foundTable = tables.findOne({ _id: tableId });
    if(foundTable !== null) {
      // order without price
      const collect = db.collection('orders'); 
      const orders = await collect.find({ table_id: parseInt(tableId) }).toArray();

      // fetch the price
      const itemIds = orders.flatMap(order => order.item.id);
      // convert to ObjectId
      const objectIdArray = itemIds.map(itemId => new ObjectId(itemId));
      for (const order of orders) {
        const dynamicCollection = db.collection(order.item.category_id);
        const itemDetails = await dynamicCollection.find({ _id : { $in: objectIdArray } }).toArray();
        if(itemDetails) {
          itemDetails.map((item) => {
                order.item.price = parseFloat(item.price.toString());
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