import { trace } from "@opentelemetry/api";

export function createTracer() {
    return trace.getTracer(process.env.KAFKA_CLIENT_ID);
}