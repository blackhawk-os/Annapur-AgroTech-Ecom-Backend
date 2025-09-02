const mongoose = require("mongoose");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");

// Helper to generate orderId
const generateOrderId = () => {
  return 'ORD' + Date.now() + Math.random().toString(36).slice(2, 5).toUpperCase();
};

// Create a new order from cart
exports.createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { shipping, tax, customer, shippingAddress, paymentMethod } = req.body;

    if (!customer || !shippingAddress) {
      return res.status(400).json({
        success: false,
        error: "Customer and shippingAddress must be provided"
      });
    }

    // 1. Find user's cart
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty" });
    }

    // 2. Calculate subtotal from cart items
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 3. Calculate total
    const total = subtotal + shipping + tax;

    // 4. Map cart items to order items
    const orderItems = cart.items.map(item => ({
      id: item.id,
      productId: item.productId._id,
      name: item.name,
      image: item.image,
      price: item.price,
      category: item.category,
      quantity: item.quantity,
      itemTotal: item.price * item.quantity
    }));

    // 5. Create new order with orderId generated manually
    const order = new Order({
      orderId: generateOrderId(),   // ✅ crucial fix
      userId: new mongoose.Types.ObjectId(userId),
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone
      },
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state
      },
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "completed"
    });

    // 6. Save order
    await order.save();

    // 7. Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId })
      .populate('items.productId');
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, error: "Invalid status" });

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email')
      .populate('items.productId');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
