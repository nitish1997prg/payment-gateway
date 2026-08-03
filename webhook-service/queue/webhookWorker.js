import "../config/env.js";
import { Worker } from "bullmq";
import { connection } from "./connection.js";
import axios from "axios";
import { WEBHOOK_DELIVERY_QUEUE } from "../constants/WebhookQueue.js";

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
        console.log(`Job ${job.id} completed.`);
    });

    worker.on("failed", (job, err) => {
        console.error(`Job ${job?.id} failed:`, err.message);
    });

    worker.on("error", (err) => {
    console.error("Worker error encountered:", err);
    });

    console.log("Web hook worker started!");

    return worker;
}


