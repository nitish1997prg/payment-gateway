import { KAFKA_TOPICS } from "../constants/KafkaTopics.js";
import { OUTBOX_STATUS } from "../enums/OutboxStatus.js";
import { publishEvent } from "../kafka/producer.js";
import { Outbox } from "../models/OutboxEvent.js";
import { withSpan } from "../telemetry/withSpan.js";
import { logger } from "../utils/logger.js";

const MAX_RETRIES = 10;
export async function retryOutboxEvents(){
    try {
        while(true){

            let event;
            event = await Outbox.findOneAndUpdate({
                status: OUTBOX_STATUS.PENDING,
                retryCount: {$lt: MAX_RETRIES}
            },
            {
                $set: {
                    status: OUTBOX_STATUS.PUBLISHING
                }
            },
            {
                returnDocument: "after"
            }
            );
           
               

            if(!event){
             return;
            }

            await withSpan("Retry Outbox Event",async (span)=>{
                span.setAttributes({
                    "payment.paymentId": event.aggregateId,
                    "outbox.eventId": event.eventId,
                    "outbox.eventType": event.eventType,
                    "outbox.retryCount": event.retryCount
                });
                try{
                    await withSpan("Publish Kafka Event",async ()=>{
                        await publishEvent(KAFKA_TOPICS.PAYMENTS,event.aggregateId,event.payload);
                    });
        

                await withSpan("Mark Outbox Published",async ()=>{
                    await Outbox.updateOne(
                        {
                            eventId: event.eventId
                        },
                        {
                            $set: {
                                status: OUTBOX_STATUS.PUBLISHED,
                                publishedAt: new Date(),
                                lastError: null
                            }
                        }
                    );
                });

          

                    logger.info({
                        eventId: event.eventId,
                        eventType: event.eventType
                    },"Outbox event published!");
            


            }catch(error){
                    logger.error({
                        err: error
                    },"Error publishing outbox event!");

                await withSpan("Mark Outbox Failed",async ()=>{
                    const nextRetryCount = event.retryCount + 1;
                await Outbox.updateOne(
                        { eventId: event.eventId },
                        {
                            $set: {
                                status:
                                    nextRetryCount >= MAX_RETRIES
                                        ? OUTBOX_STATUS.FAILED
                                        : OUTBOX_STATUS.PENDING,
                                lastError: error.message
                            },
                            $inc: {
                                retryCount: 1
                            }
                        }
                    );
                });
              
            }
                });
            
        }

    }catch(error){
        logger.error({
            err: error
        },"Error retrying outbox events!");
        throw error;
    }
}

export function startOutboxRecovery() {
    logger.info("Starting Outbox recovery....");

    setInterval(async () => {
        try {
          
            await retryOutboxEvents();
        } catch (error) {
            console.error("Outbox recovery failed:", error);
        }
    }, 30000);
}