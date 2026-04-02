const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing. Create a .env file in the patient-service root and set MONGO_URI.",
      );
    }

    // Connect this microservice to its own MongoDB database.
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "patients_db",
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
