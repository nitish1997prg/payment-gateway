import { KAFKA_TOPICS } from "../constants/KafkaTopics.js";
import { OUTBOX_STATUS } from "../enums/OutboxStatus.js";
import { publishEvent } from "../kafka/producer.js";
import { Outbox } from "../models/OutboxEvent.js";
import { logger } from "../utils/logger.js";

export async function watchOutbox(){
    try {

        const changeStream = Outbox.watch([]);

        console.log("Watching outbox collection!");

        changeStream.on("change",async (change)=>{
            if(change.operationType !== "insert"){
                return;
            }
            try {
                await publishEvent(KAFKA_TOPICS.PAYMENTS,change.fullDocument.aggregateId,change.fullDocument.payload);
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
                logger.info({
                    aggregateId: change.fullDocument.aggregateId
                },"Outbox event published!");
            }catch(error){
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

                logger.error({
                    err: error
                })
            }
                
            
        });

        changeStream.on("error",(error)=>{
            console.error("ChangeStream error!",error);
        });

    }catch(error){
        console.error("Error watching outbox!");
        throw error;
    }
    
}