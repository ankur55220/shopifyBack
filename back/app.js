const express= require("express");
const bodyParser= require("body-parser");
const mongoose=require("mongoose");
const cors= require("cors")
const app=express();
const dotenv=require("dotenv").config()


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(cors())

console.log(process.env.DB_HOST)

const totalItems=require('./routes/itemRouts/itemRoute')

// mongoose.connect(process.env.DB_HOST,{
    
//     useNewUrlParser: true,
//     useUnifiedTopology: true,

// })
// .then(()=>console.log("connected to the database successfully"))
// .catch((error)=>console.log(error))


app.use("/app",totalItems)


export default app;



