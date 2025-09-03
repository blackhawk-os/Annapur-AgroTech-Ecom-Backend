const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  itemTotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  subtotal: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  
  // Customer info (from checkout form)
  customer: {
    fullName: {type: String,required: true},
    email: {type: String,required: true},
    phone: {type: String, required: true},
  },
  
  // Shipping address (from checkout form)
  shippingAddress: {
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
  },
  
  // Payment (from checkout form)
  paymentMethod: {type: String,
    enum: ['cod', 'card', 'upi', 'esewa'],
    required: true,
  },
  paymentStatus: {type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  
  // Order status
  status: {type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: {type: Date,
    default: Date.now
  },
  updatedAt: {type: Date,
    default: Date.now
  }
});

// Generate order ID and update timestamp
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (!this.orderId) {
    this.orderId = 'ORD' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);