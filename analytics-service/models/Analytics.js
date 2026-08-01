import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    paymentsCreated: {
        type: Number,
        default: 0
    },
    paymentsCaptured: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    }
},{timestamps: true});

export const Analytics = mongoose.model("Analytic",analyticsSchema);