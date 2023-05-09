const mongoose=require("mongoose");

const itemSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    items:[
        {
            name:{
                type:String,
                required:true
            },
            photo:{
                type:String,
                required:true
            },
            note:{
                type:String
            }
        }
    ]
},{
    timestamps:true
})




module.exports =mongoose.model("Item",itemSchema);