const { ObjectId, Decimal128  } = require('mongodb');
const express = require('express');
const router = express.Router();

const { connectToDatabase, closeDatabaseConnection } = require('../server');

router.post('/updateTableInvoice', async (req, res) => {
    try {
        let color = '', message = '', pay = false;
        const { tableNumber, amountLeft } = req.body;
        let db = await connectToDatabase();
        const tables = db.collection('tables');
        let _id = parseInt(tableNumber);
        const amountLeftDecimal = Decimal128.fromString(amountLeft.toString());
        
        if(amountLeft <= 0) {
            const orders = db.collection('orders'); 
            // register the quantity sold out for popular products
            const popular = db.collection('popular');
            if (popular.length === 0) {
                await database.createCollection('popular');
            }
            // take all items on this table
            const items = await orders.find({ table_id : _id }).toArray();

            // count how many times this item is sold out
            const soldOut = items.reduce((result,detail) => {
                const ID = detail.item.id.split('_')[0];
                const quantity = detail.quantity;
                // If the item ID is already present in the result object, add the quantity
                if (result[ID]) {
                  result[ID] += quantity;
                } else {
                  // If the item ID is not present, initialize it with the quantity
                  result[ID] = quantity;
                }
                return result;
            }, {});
            // update or insert
            for (const ID in soldOut) {
                const query = { _id: new ObjectId(ID), soldOut: soldOut[ID] };
                const existingItem = await popular.findOne({ _id: new ObjectId(ID) });
                if(existingItem) {
                    await popular.updateOne({ _id: new ObjectId(ID) }, { $set: { soldOut: existingItem.soldOut + soldOut[ID] } });
                } else {
                    await popular.insertOne(query);
                }
            }
            
            // delete the table and orders associated to it
            await orders.deleteMany({ table_id : _id});
            await tables.findOneAndDelete({ _id });
            color = 'green';
            message = `the table no ${tableNumber} is paid and now closed.`;
            pay = true;
        } else {
            // upsert will create a new field if it does not exist
            const condition = { _id  };
            const createNewFields = { $set: { amountLeft : amountLeftDecimal } };
            await tables.findOneAndUpdate(condition,createNewFields,{ upsert: true });
            color = 'orange';
            message = `the amount unpaid is $ ${amountLeftDecimal} of table no ${tableNumber} is saved.`;
        }
        res.status(200).json({ pay, color, message });
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