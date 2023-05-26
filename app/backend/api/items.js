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

module.exports = router;