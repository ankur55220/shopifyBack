import { Database } from "./database";
import app from "./app";

const PORT=process.env.PORT || 5000;

Database().then(()=>{

    app.listen(PORT,()=>{
        console.log("listening successfuly");
    })

})


