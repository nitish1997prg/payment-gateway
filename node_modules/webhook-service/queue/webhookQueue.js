import { Queue } from "bullmq";
import { connection } from "./connection.js";
import {WEBHOOK_DELIVERY_QUEUE} from "@payment-gateway/shared";

export const webhookDeliveryQueue = new Queue(
    WEBHOOK_DELIVERY_QUEUE,
    {
        connection
    }
);