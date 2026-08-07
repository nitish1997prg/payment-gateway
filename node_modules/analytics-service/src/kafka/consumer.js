import { handlePaymentEvent } from "../handlers/paymentEventHandler.js";
import { trace,context } from "@opentelemetry/api";
import { KAFKA_TOPICS, logger, extractTraceContext, createKafkaClient } from "@payment-gateway/shared";



const CONSUMER_GROUP = process.env.CONSUMER_GROUP;

const kafka = createKafkaClient();
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
                           try {
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

                            const extractedConext = extractTraceContext(message.headers);

                            const event = JSON.parse(message.value.toString());
                            console.log("Consumer Data:",event);
                            await context.with(
                                extractedConext,
                               async () => {
                                await handlePaymentEvent(event);
                               }
                            )
                            await handlePaymentEvent(event);
                           }catch(error){
                            console.error("[Analytics] failed to process event",error);
                           }
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