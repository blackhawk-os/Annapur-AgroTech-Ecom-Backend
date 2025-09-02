const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
 firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, unique: true, required: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ["buyer", "farmer", "admin"], default: "buyer" },
  is_guest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

//Hash password before saving
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) 
        return next();

     this.password = await bcrypt.hash(this.password, 10);
     next();
});

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
