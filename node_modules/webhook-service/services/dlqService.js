import { webhookDeliveryQueue } from "../queue/webhookQueue.js";
import { logger } from "../utils/logger.js";

export async function getFailedJobs(){
    const jobs = await webhookDeliveryQueue.getFailed();

    return jobs.map(job => ({
        jobId: job.id,
        jobName: job.name,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason,
        paymentId: job.data.data.paymentId,
        referenceId: job.data.data.referenceId,
        eventType: job.data.eventType
    }));
}

export async function retryFailedJob(jobId){

    const job = await webhookDeliveryQueue.getJob(jobId);

    if(!job){
        throw new Error("Job not found!");
    }

    const state = await webhookDeliveryQueue.getJobState(jobId);

    if(state !== "failed"){
        throw new Error(`Job is currently in state: ${state}`);
    }

    await job.retry();

    logger.info({
        jobId: jobId
    },"Job requeued");

    return {
        jobId: job.id,
        status: "requeued"
    }
}

export async function deleteFailedJob(jobId){
    
    const job = await webhookDeliveryQueue.getJob(jobId);

    if(!job){
        throw new Error("Job not found!");
    }

    const state = await webhookDeliveryQueue.getJobState(jobId);

    if(state !== "failed"){
        throw new Error(`Job is currently in state: ${state}`);
    }

    await job.remove();

    logger.info({
        jobId: jobId
    },"Job deleted");

    return {
        jobId: job.id,
        status: "deleted"
    };
}

export const DlqService = {
    getFailedJobs,
    retryFailedJob,
    deleteFailedJob
};