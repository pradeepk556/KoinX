const express = require("express");
const connectDB = require("./connectDB");

const app = express();

// connecting to database
connectDB();
const port = process.env.PORT || 3000

app.get('/', (req, res)=>{
    res.send("First Route Successfully created");
})

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});