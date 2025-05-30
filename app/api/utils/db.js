import mongoose from "mongoose";

const uri = process.env.MONGO_URI;

export const connectDB = async () => {
  console.log("Connecting to MongoDB...", uri);

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
