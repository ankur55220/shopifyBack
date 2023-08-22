const mongoose=require("mongoose")

export const Database = async()=>{
    try{

       const con=await mongoose.connect(process.env.DB_HOST,{
    
            useNewUrlParser: true,
            useUnifiedTopology: true,
        
        })

        console.log(`connected to database`)

    }
    catch(err){

        console.log("error")

    }
}