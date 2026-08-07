import { context, propagation } from "@opentelemetry/api";

export function injectTraceContext() {
    const headers = {};

    propagation.inject(context.active(), headers);

    return headers;
}

export function extractTraceContext(headers = {}) {

    const carrier = {};

    for (const [key, value] of Object.entries(headers)) {
        carrier[key] =
            Buffer.isBuffer(value)
                ? value.toString()
                : value;
    }

    return propagation.extract(context.active(), carrier);
}