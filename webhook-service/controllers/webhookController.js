import { DlqService } from "../services/dlqService.js";

export async function getFailedJobs(req,res){
    try {

        const failedJobs = await DlqService.getFailedJobs();

        return res.status(200).json(failedJobs);

    }catch(error){
        console.error("Error fetching failed jobs!",error);
        return res.status(500).json({
            message: "An internal server error occurred while fetching failed BullMQ jobs!"
        });
    }
}

export async function retryFailedJob(req,res){
    try {

        const params = req.params;
        if(!params){
            return res.status(400).json({
                message: "Request params not passed in request!"
            });
        }

        const {jobId} = params;

        if(!jobId){
            return res.status(400).json({
                message: "JobId not passed in path params!"
            });
        }

        const result = await DlqService.retryFailedJob(jobId);

        return res.status(200).json(result);

    }catch(error){
        console.error("Error retrying failed job!",error);
        return res.status(500).json({
            message: "An internal server error occurred while retrying failed BullMQ job!"
        });
    }
}

export async function deleteFailedJob(req,res){
    try {

        const params = req.params;
        if(!params){
            return res.status(400).json({
                message: "Request params not passed in request!"
            });
        }

        const {jobId} = params;

        if(!jobId){
            return res.status(400).json({
                message: "JobId not passed in path params!"
            });
        }

        const result = await DlqService.deleteFailedJob(jobId);

        return res.status(200).json(result);


    }catch(error){
        console.error("Error deleting failed job!",error);
        return res.status(500).json({
            message: "An internal server error occurred while deleting failed BullMQ job!"
        });
    }
}

export const WebhookController = {
    getFailedJobs,
    retryFailedJob,
    deleteFailedJob
};