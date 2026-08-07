import "../config/env.js";
import { Worker } from "bullmq";
import { connection } from "./connection.js";
import axios from "axios";
import { context } from "@opentelemetry/api"
import { logger, WEBHOOK_DELIVERY_QUEUE} from "@payment-gateway/shared";
import { extractTraceContext } from "../telemetry/propagation.js";
import {withSpan} from "../telemetry/withSpan.js";

export function startWebhookWorker() {
    const worker =  new Worker(
    WEBHOOK_DELIVERY_QUEUE,
    async (job) => {
        console.log("Recieved job!");
        console.log("Job data",job.data);
        switch(job.name){
            case "deliver-webhook":
                const extractedContext = extractTraceContext(job.data.traceContext);
                await context.with(extractedContext, async ()=>{
                    await withSpan("Send Webhook Job",async (span)=>{
                    
                    span.setAttributes({
                        "payment.paymentId": job.data.paymentId,
                        "payment.eventType": job.eventType,
                        "payment.traceId": job.traceId,
                        "payment.merchantId": job.data.merchantId
                    })
                    await axios.post(process.env.MERCHANT_WEBHOOK_URL,job.data,
                      {
                        headers: {
                        "X-Trace-Id": job.data.traceId
                        }
                        }
                    );
                     });
                });
                          
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
            traceId: job?.data?.traceId,
            jobId: job.id
        },"Job completed");
    });

    worker.on("failed", (job, err) => {
        logger.error({
            traceId: job?.data?.traceId,
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


