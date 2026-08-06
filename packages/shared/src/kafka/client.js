import { Kafka } from "kafkajs";

export function createKafkaClient() {
    return new Kafka({
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER]
    });
}