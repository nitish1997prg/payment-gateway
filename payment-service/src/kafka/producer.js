import {kafka} from "./client.js";
import { injectTraceContext } from "../telemetry/propagation.js";

export const producer = kafka.producer();

export async function startProducer(){
    await producer.connect();
    console.log("Kafka Producer Connected!");
}

export async function stopProducer(){
    await producer.disconnect();
    console.log("Kafka Producer Disconnected!");
}

export async function publishEvent(topic,key,message){
    await producer.send(
        {
            topic,
            messages: [
                {
                    key,
                    value: JSON.stringify(message),
                    headers: injectTraceContext()
                }
            ]
        }
    );
    console.log(`Published event ${key} to topic ${topic}`);
}