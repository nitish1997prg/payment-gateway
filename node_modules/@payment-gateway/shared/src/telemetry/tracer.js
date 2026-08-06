import { trace } from "@opentelemetry/api";

export function createTracer(serviceName) {
    return trace.getTracer(serviceName);
}