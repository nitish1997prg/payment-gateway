import {kafka} from "./client.js";

const consumer = kafka.consumer({
    groupId: "payments-group"
});

export async function startConsumer(){
    await consumer.connect();

    await consumer.subscribe(
        {
            topic: "payments",
        }
    );

    console.log("Kafka Consumer Connected!");

    await consumer.run(
        {
            eachMessage: async ({topic,partition,message})=> {
                            console.log("Received event:");
                            const payload = JSON.parse(message.value.toString());
                            console.log("Consumer Data:",payload);
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