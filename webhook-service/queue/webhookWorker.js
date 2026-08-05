import "../config/env.js";
import { Worker } from "bullmq";
import { connection } from "./connection.js";
import axios from "axios";
import { WEBHOOK_DELIVERY_QUEUE } from "../constants/WebhookQueue.js";
import { logger } from "../utils/logger.js";

export function startWebhookWorker() {
    const worker =  new Worker(
    WEBHOOK_DELIVERY_QUEUE,
    async (job) => {
        console.log("Recieved job!");
        console.log("Job data",job.data);
        switch(job.name){
            case "deliver-webhook":
                await axios.post(process.env.MERCHANT_WEBHOOK_URL,job.data);
                break;
            default:
                console.log(`[Webhook Worker] Ignoring job: ${job.name}`);
        }
    },
    {
        connection
    }
    );

    worker.on("completed", (job) => {
        logger.info({
            jobId: job.id
        },"Job completed");
    });

    worker.on("failed", (job, err) => {
        logger.error({
            err: err,
            jobId: job?.id 
        },"Job failed");
    });

    worker.on("error", (err) => {
    logger.error({
        err: err
    },"Worker error encountered");
    });

    console.log("Web hook worker started!");

    return worker;
}


