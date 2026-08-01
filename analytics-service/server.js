import "./config/env.js";
import { connectDb } from "./config/db.js";
import { app } from "./app.js";

const PORT = process.env.PORT;
const MONGO_URI =  process.env.MONGO_URI;

async function startServer(){
    try {
        //Connect to MongoDB
        await connectDb(MONGO_URI);

        app.listen(PORT,()=>{
            console.log(`Server listening on PORT: ${PORT}`);
        });

    }catch(error){
        console.error("Error starting server!",error);
        process.exit(1);
    }
}