const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Create new order
router.post("/orders/:userId/create", orderController.createOrder);

// Get all orders for a user
router.get("/orders/user/:userId", orderController.getUserOrders);

// Get all orders (admin) - static route first
router.get("/orders", orderController.getAllOrders);

// Get order by ID - dynamic route after static
router.get("/orders/:orderId", orderController.getOrderById);

// Update order status (admin)
router.put("/orders/:orderId/status", orderController.updateOrderStatus);

module.exports = router;
