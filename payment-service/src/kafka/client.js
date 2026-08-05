import "../config/env.js";
import { Kafka } from "kafkajs";

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const KAFKA_BROKER = process.env.KAFKA_BROKER;

export const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: [KAFKA_BROKER]
});