import "./config/env.js";

import { initializeTelemetry } from "@payment-gateway/shared";
initializeTelemetry();

import { startConsumer } from "./kafka/consumer.js";
import { retry } from "@payment-gateway/shared";


async function startServer(){
    try {

        //Start consumer
        await retry(startConsumer,{
            operationName: "Start Kafka Consumer"
        });

    }catch(error){
        console.error("Error starting server!",error);
        process.exit(1);
    }
}

await startServer();