import { AnalyticsService } from "../services/analyticsService.js";
//Get all analytics
export async function getAnalyticsHistory(req,res){
    try{
        const analytics = await AnalyticsService.getAllAnalytics();

        return res.status(200).json(analytics);

    }catch(error){
        console.error("Error fetching analytics!",error);
        return res.status(500).json({
            message: "An internal server error occurred while fetching analytics!"
        });
    }
}

//Get Todays analytics
export async function getTodaysAnalytics(req,res){
    try {
        const analytics = await AnalyticsService.getTodaysAnalytics();

        return res.status(200).json(analytics);
    }catch(error){
        console.error("Error fetching todays analytics!",error);
        return res.status(500).json({
            message: "An internal server error occurred while fetching todays analytics!"
        });
    }
}

export const AnalyticsController = {
    getAnalyticsHistory,
    getTodaysAnalytics
};