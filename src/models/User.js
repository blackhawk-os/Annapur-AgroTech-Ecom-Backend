const mongoose = require("mongoose");
const { is, en } = require("zod/locales");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ["buyer", "farmer", "admin"], default: "buyer" },
  is_guest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
