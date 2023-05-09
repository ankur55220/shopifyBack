const mongoose=require("mongoose");

const listSchema= new mongoose.Schema({
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
            quantity:{
                type:Number,
                default:0

            },
            completed:{
                type:Boolean,
                default:false
            }
           }
           
        
    ]
},{
    timestamps:true
})




module.exports =mongoose.model("List",listSchema);