import mongoose from "mongoose";

export const connectDB = async () => {
  const conn = await mongoose.connect(
v    {}
  );
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
