import { KAFKA_TOPICS } from "../constants/KafkaTopics.js";
import { handlePaymentEvent } from "../handlers/paymentEventHandler.js";
import {kafka} from "./client.js";

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
            eachMessage: async ({message})=> {
                           try {
                            const event = JSON.parse(message.value.toString());
                            console.log("Consumer Data:",event);
                            await handlePaymentEvent(event);
                           }catch(error){
                            console.error("[Analytics] failed to process event",error);
                            throw error;
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