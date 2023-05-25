const express = require('express');
const router = express.Router();

const { connectToDatabase, closeDatabaseConnection } = require('../server');

// Get all items
router.get('/', async (req, res) => {
  try {
    let db = await connectToDatabase();
    const collection = db.collection('desserts'); // Replace 'items' with your actual collection name
    const items = await collection.find({}).toArray();
    console.log(items);
    res.json(items);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch items from MongoDB' });
  } finally {
    await closeDatabaseConnection();
  }
});

module.exports = router;