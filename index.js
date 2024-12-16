const express = require('express');
const app = express();
const mongoose = require('mongoose');
const axios = require('axios');
const Transaction = require('./transaction.model');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING || 'mongodb:/.localhost:27017/mydatabase', {
    useNewURLParser: true,
    useUnifiedTopology: true,
});

app.use(express.json());
app.get('/api/init-db', async (req, res) => {
    try {
        const response = await axios.get('(link unavailable)');
        const data = response.data;
        await Transaction.insertMany(data);
        res.send('Database initialized successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error initializing database');
    }
});

app.get('/api/transaction', async (req, res) => {
    try {
        const month = req.query.month;
        const search = req.query.search;
        const page = req.query.page;
        const perPage = req.query.perPage;
        const transactions = await Transaction.find({
            dateofSale: {$regex: `^${month}`, $options: 'i'},
        })
        .skip((page - 1)* perPage)
        .limit(perPage);
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching transactions');
    }
});

app.get('/api/transaction', async (req, res) => {
    try {
        const month = req.query.month;
        const totalSaleAmounts = await Transaction.aggregate([
            { $match: {dateofSale: { $regex: `^${month}`, $options: 'i'}}},
            { $group: {_id: null, totalSaleAmount: {$sum: '$saleAmount'}}},
        ]);
        const totalSaleAmount = await Transaction.countDocuments({
            dateofSale: { $regex: `^${month}`, $options: 'i'},
            sold: true,
        });
        const totalSaleAmounte = await Transaction.countDocuments({
            dateofSale: { $regex: `^${month}`, $options: 'i'},
            sold: false,
        });
        res.json({
            totalSaleAmount: totalSaleAmount[0].totalSaleAmount,totalSoldItems,totalNotSoldItems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('error fetching statistics');
    }
});
 app.listen(3000, () => {
    comnsole.log('Server listening on port 3000');
 });

