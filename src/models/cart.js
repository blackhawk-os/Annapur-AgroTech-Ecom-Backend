const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  id: {  type: String,  required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',  
    required: true },
  name: {type: String, required: true},
  image: {type: String, required: true},
  price: { type: Number,  required: true },
  category: {type: String, required: true,},
  quantity: { type: Number,  required: true, min: 1, max: 50},
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  required: true 
  },
  items: [cartItemSchema],
  subTotal: { type: Number, default: 0 },
  shipping: {type: Number,default: 0 },
   tax: {type: Number, default: 0},
  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Updated timestamps and calculated totals before saving
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculated totals
  this.subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  //Calculated Shipping
  this.shipping = this.subtotal >= 1000 ? 0 : 50;

  //Calculated tax ( 10%)
  this.tax = this.subtotal * 0.1;

  //Calculated final total
  this.total = this.subtotal + this.shipping + this.tax;


  next();
});

module.exports = mongoose.model("Cart", cartSchema);