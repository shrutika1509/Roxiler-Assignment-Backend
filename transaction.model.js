const mongoose = require('mongoose');
mongoose.Schema({
    dateofSale: String,
    saleAmount: Number,
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
                                                                                                                                                                                