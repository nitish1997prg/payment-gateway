import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [SemanticResourceAttributes.SERVICE_NAME]:
            process.env.KAFKA_CLIENT_ID
    }),

    traceExporter: new OTLPTraceExporter({
        url: "http://jaeger:4318/v1/traces"
    }),

    instrumentations: [
        getNodeAutoInstrumentations()
    ]
});

sdk.start();

console.log("OpenTelemetry initialized");