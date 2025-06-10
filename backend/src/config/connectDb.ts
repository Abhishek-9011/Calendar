import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDb() {
  try {
    //@ts-ignore
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}