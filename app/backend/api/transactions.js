const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();

const { connectToDatabase, closeDatabaseConnection } = require('../server');

router.post('/updateTableInvoice', async (req, res) => {
    try {
        let color = '', message = ''
        const { tableNumber, amountLeft } = req.body;
        let db = await connectToDatabase();
        const tables = db.collection('tables');
        let _id = parseInt(tableNumber);
        // delete the table and orders associated to it
        if(amountLeft <= 0) {
            const orders = db.collection('orders'); 
            await orders.deleteMany({ table_id : _id})
            await tables.findOneAndDelete({ _id })
            color = 'green'
            message = `the table no ${tableNumber} is paid and now closed.`
        } else {
            // upsert will create a new field if it does not exist
            const condition = { _id  }
            const createNewFields = { $set: { amountLeft } };
            await tables.findOneAndUpdate(condition,createNewFields,{ upsert: true });
            color = 'orange'
            message = `the amount unpaid is $ ${amountLeft} of table no ${tableNumber} is saved.`
        }
        res.status(200).json({ color, message });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to save the amount left.' });
    } finally {
        await closeDatabaseConnection();
    }
});

router.post('/fetchOneAmountLeft', async (req, res) => {
    try {
        const { tableNumber } = req.body;
        let db = await connectToDatabase();
        const tables = db.collection('tables');
        let _id = parseInt(tableNumber);
        const result = await tables.findOne({ _id });
        res.status(200).json({ amountLeft: result.amountLeft , message: 'amount left is fetched.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to find the amount left.' });
    }
})

module.exports = router;