import { startConsumer } from "./kafka/consumer.js";
import { startWebhookWorker } from "./queue/webhookWorker.js";

async function startServer(){
    try {
        //Start the Kafka consumer
        await startConsumer();

        //Start BullMQ Webhook Worker
        startWebhookWorker();

    }catch(error){
        console.error("Error starting the webhook-service server!",error);
        process.exit(1);
    }
}

await startServer();