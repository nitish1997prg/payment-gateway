import { context, propagation } from "@opentelemetry/api";

export function injectTraceContext() {
    const headers = {};

    propagation.inject(context.active(), headers);

    return headers;
}

export function extractTraceContext(headers) {
    return propagation.extract(context.active(), headers);
}