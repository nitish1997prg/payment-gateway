import {kafka} from "./client.js";
import { injectTraceContext } from "../telemetry/propagation.js";
import { context, trace } from "@opentelemetry/api";

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
    console.log(
    "Producer Trace:",
    trace.getSpan(context.active())?.spanContext().traceId
);
   const headers = injectTraceContext();

    console.log("Headers:",headers);
    await producer.send(
        {
            topic,
            messages: [
                {
                    key,
                    value: JSON.stringify(message),
                    headers: headers
                }
            ]
        }
    );
    console.log(`Published event ${key} to topic ${topic}`);
}