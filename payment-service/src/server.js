import "./telemetry.js";
import "./config/env.js";
import {app} from "./app.js";
import { connectMongo, retry } from "@payment-gateway/shared";
import { startProducer } from "./kafka/producer.js";
import { startConsumer } from "./kafka/consumer.js";
import { watchOutbox } from "./outbox/watcher.js";
import { startOutboxRecovery } from "./outbox/recovery.js";

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

async function startServer(){
    try {
        //Connect to MongoDB
        await retry(
            ()=>connectMongo(MONGO_URI),{
                operationName: "MongoDB Connection"
            });

        //Connect Kafka Producer
        await retry(
            startProducer,
            {
                operationName: "Start Kafka Producer"
            }
        );

        await watchOutbox();

        startOutboxRecovery();

        //Connect Kafka Consumer
        //await startConsumer();

        app.listen(PORT,()=>{
            console.log(`Server listening on PORT: ${PORT}`);
        });

    }catch(error){
        console.error("Error starting server!",error);
        process.exit(1);
    }
}

await startServer();