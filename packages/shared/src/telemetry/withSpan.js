import { SpanStatusCode } from "@opentelemetry/api";
import { createTracer } from "./tracer.js";

const tracer = createTracer();
export async function withSpan(name, callback) {
    console.log(`Starting span: ${name}`);
    return tracer.startActiveSpan(name, async (span) => {
        try {
            const result = await callback(span);

            span.setStatus({
                code: SpanStatusCode.OK
            });

            return result;

        } catch (error) {

            span.recordException(error);

            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message
            });

            throw error;

        } finally {

            span.end();

        }
    });
}