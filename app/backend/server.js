// run backend before use
// middleware
const express = require('express');
const cors = require('cors');
const app = express();
// const port = 8000;
const path = require('path');

// mongodb
const { MongoClient,ServerApiVersion } = require('mongodb');
const DB_NAME = 'easyorder'
const uri = 'mongodb+srv://admin:uGwRHCoQiqIseBrj@codeshaker.vxu0uru.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// connect and disconnect methods
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Mongodb server is now operational');
    return client.db(DB_NAME)
  } catch (error) {
    console.error('Failed to connect to MongoDb',error);
    throw error;
  }
}

const closeDatabaseConnection = async () => {
  if(client) {
    client.close()
    console.log('Disconnected from MongoDB');
  }
}

module.exports = { connectToDatabase, closeDatabaseConnection };

// change the origin 3000 to 8000 for the queries
const corsOptions = {
  origin: 'https://easyorder-3bskanvrm-mikemaoche.vercel.app',
  // origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

// additional hears for cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://easyorder-3bskanvrm-mikemaoche.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());

// Serve static files from the 'build' folder
app.use(express.static(path.join(__dirname, 'build')));

// API routes
const itemsRouter = require('../backend/api/items');
app.use('/api/items', itemsRouter);

const transactionsRouter = require('../backend/api/transactions');
app.use('/api/transactions', transactionsRouter);

// app.listen(port, () => {
//   console.log(`API server running on port ${port}`);
// });
