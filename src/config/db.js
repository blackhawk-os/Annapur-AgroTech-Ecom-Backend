const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(" MONGO_URI is not set in .env");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, { autoIndex: true });
    console.log(` MongoDB connected to: ${conn.connection.name}`);
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
