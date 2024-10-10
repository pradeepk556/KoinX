const mongoose = require('mongoose');

const cryptoSchema = mongoose.Schema({
    coin:{
        required: true,
        type: String
    },
    price:{
        required: true,
        type: Number
    },
    marketCap: {
        required: true,
        type: Number
    },
    change24h:{
        required: true,
        type: Number
    },
    timestamp: { type: Date, default: Date.now }
})

const Crypto = mongoose.model('Crypto', cryptoSchema);
module.exports =  Crypto;