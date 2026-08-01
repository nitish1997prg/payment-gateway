import mongoose from "mongoose";

export async function connectDb(uri) {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully!");
    }catch(error){
        console.error("Error connecting to database!",error);
        throw error;
    }
}