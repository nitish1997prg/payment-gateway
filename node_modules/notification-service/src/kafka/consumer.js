import { KAFKA_TOPICS } from "../constants/KafkaTopics.js";
import { handlePaymentEvent } from "../handlers/paymentEventHandler.js";
import { logger } from "../utils/logger.js";
import {kafka} from "./client.js";

import { trace,context } from "@opentelemetry/api";
import { extractTraceContext } from "../telemetry/propagation.js";

const CONSUMER_GROUP = process.env.CONSUMER_GROUP;

const consumer = kafka.consumer({
    groupId: CONSUMER_GROUP
});

export async function startConsumer(){
    await consumer.connect();

    await consumer.subscribe(
        {
            topic: KAFKA_TOPICS.PAYMENTS,
        }
    );

    console.log("Kafka Consumer Connected!");

    await consumer.run(
        {
            eachMessage: async ({topic,partition,message})=> {
                 console.log("Message Headers:",message.headers);
                console.log(
                    "Consumer Trace:",
                    trace.getSpan(context.active())?.spanContext().traceId
                );
                                logger.info(
                                  {
                                    topic,
                                    partition,
                                    offset: message.offset
                                    },
                                    "Kafka event received"
                                );
                            const extractedContext = extractTraceContext(message.headers);
                            const payload = JSON.parse(message.value.toString());
                            logger.info({
                                payload: payload
                            },"Consumer Data");
                            await context.with(
                                extractedContext,
                                async ()=> {
                                  await handlePaymentEvent(payload);
                                }
                            );
                        }
        }
    )
}

consumer.on(consumer.events.CRASH, (event) => {
    console.error("Consumer crashed:", event.payload.error);
});

consumer.on(consumer.events.CONNECT, () => {
    console.log("Consumer connected");
});