const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema(
    {
    label: { type: String, default: "Home" }, // e.g. "Home", "Office"
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);


const userSchema = new mongoose.Schema({
 firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, unique: true, required: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true, minlength: 6, select: false },

  is_guest: { type: Boolean, default: false },

 shippingAddresses: [addressSchema],
  
 role:{
    type: String,
    enum: ["buyer","farmer", "admin"],
    default: "buyer",
 },
},
   { timestamps: true}
);

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
