import { startConsumer } from "./kafka/consumer.js";

async function startServer(){
    try {
        //Start the Kafka consumer
        await startConsumer();

    }catch(error){
        console.error("Error starting the webhook-service server!",error);
        process.exit(1);
    }
}

await startServer();