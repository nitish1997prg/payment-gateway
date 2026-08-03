import "./config/env.js";
import {app} from "./app.js";
import { startConsumer } from "./kafka/consumer.js";
import { startWebhookWorker } from "./queue/webhookWorker.js";

const PORT = process.env.PORT;

async function startServer(){
    try {
        //Start the Kafka consumer
        await startConsumer();

        //Start BullMQ Webhook Worker
        startWebhookWorker();

        app.listen(PORT,()=>{
            console.log(`Webhook Service Server successfully listening on PORT:${PORT}`);
        });

    }catch(error){
        console.error("Error starting the webhook-service server!",error);
        process.exit(1);
    }
}

await startServer();