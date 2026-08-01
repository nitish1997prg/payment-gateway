import "./config/env.js"
import { startConsumer } from "./kafka/consumer.js";


async function startServer(){
    try {

        //Start consumer
        await startConsumer();

    }catch(error){
        console.error("Error starting server!",error);
        process.exit(1);
    }
}

await startServer();