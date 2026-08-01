import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "payment-gateway",
    brokers: ["localhost:9092"]
});