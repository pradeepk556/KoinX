require('dotenv').config()
const mongoose = require('mongoose');

const connectDB  = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Successfully connected to local DB");
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = connectDB;