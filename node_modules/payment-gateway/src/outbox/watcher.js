import { publishEvent } from "../kafka/producer.js";
import { Outbox } from "../models/OutboxEvent.js";
import { logger,withSpan,OUTBOX_STATUS, KAFKA_TOPICS } from "@payment-gateway/shared";

export async function watchOutbox(){
        try {
        const changeStream = Outbox.watch([]);

        logger.info("Watching Outbox collection!");

        changeStream.on("change",async (change)=>{
            if(change.operationType !== "insert"){
                return;
            }

            await withSpan("Process Outbox Event",async (span)=>{
                span.setAttribute("payment.paymentId",change.fullDocument.aggregateId);
                try {
                await withSpan("Publish Kafka Event",async ()=>{
                    await publishEvent(KAFKA_TOPICS.PAYMENTS,change.fullDocument.aggregateId,change.fullDocument.payload);
                })
                
                await withSpan("Update Outbox Status",async ()=>{
                    await Outbox.updateOne(
                    {
                        eventId: change.fullDocument.eventId
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
                    aggregateId: change.fullDocument.aggregateId
                },"Outbox event published!");
            }catch(error){
                await withSpan("Update Outbox retry count on error",async ()=>{
                     await Outbox.updateOne(
                    { eventId: change.fullDocument.eventId },
                    {
                    $set: {
                        status: OUTBOX_STATUS.PENDING,
                        lastError: error.message
                    },
                    $inc: {
                        retryCount: 1
                    }
                }
                );
                });
        
                logger.error({
                    err: error
                })
            }
            });
            
        });

        changeStream.on("error",(error)=>{
            logger.error(
            {
                err: error
            },
            "Outbox change stream failed"
            );
        });

    }catch(error){
        console.error("Error watching outbox!");
        throw error;
    }

    
    
}