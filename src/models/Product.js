const mongoose = require("mongoose");

// Schema for creating products
const productSchema = new mongoose.Schema({
    name:{type: String, required: true},
    image:{type: String, required: true},
    price:{type: Number, required: true},
    short_description:{type: String, required: true},
    description:{type: String},
    category:{type:String, required:true},
    createdAt: {type: Date, default: Date.now},
    });

    module.exports = mongoose.model("Product", productSchema);
    