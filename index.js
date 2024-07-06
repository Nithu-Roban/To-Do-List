const express = require('express');
const session = require('express-session');
const path = require('path');
const { Parser } = require('json2csv');

const mongoose=require("mongoose")
const uri = "mongodb+srv://nithuroban453:123@cluster0.trjkrqs.mongodb.net/"

mongoose.connect(uri);

const app = express();
const port = 7050;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

const user_route = require("./routes/userRoute");
app.use("/", user_route);


// url running
app.listen(port, ()=>{
    console.log(`server running at http://localhost:${port}`)
});

