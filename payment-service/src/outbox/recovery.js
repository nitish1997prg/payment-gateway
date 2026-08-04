import { KAFKA_TOPICS } from "../constants/KafkaTopics.js";
import { OUTBOX_STATUS } from "../enums/OutboxStatus.js";
import { publishEvent } from "../kafka/producer.js";
import { Outbox } from "../models/OutboxEvent.js";

const MAX_RETRIES = 10;
export async function retryOutboxEvents(){
    try {
        while(true){
            const event = await Outbox.findOneAndUpdate({
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
        try{
            await publishEvent(KAFKA_TOPICS.PAYMENTS,event.aggregateId,event.payload);

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
                
                        console.log(
                `Published outbox event ${event.eventId} (${event.eventType})`
            );


        }catch(error){
            console.error("Error publishing outbox event!",error);
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
        }
        
        }

    }catch(error){
        console.error("Error retrying outbox events!",error);
        throw error;
    }
}

export function startOutboxRecovery() {
    console.log("Starting Outbox Recovery...");

    setInterval(async () => {
        try {
            await retryOutboxEvents();
        } catch (error) {
            console.error("Outbox recovery failed:", error);
        }
    }, 30000);
}