
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware, restrictTo, blockGuests } = require("../middleware/authMiddleware");
const { validateCreateOrder } = require("../middleware/validateRequest");

// check userId matches token (self-actions)
const checkUserId = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  if (req.user.role !== "admin" && req.user._id.toString() !== req.params.userId) {
    return res.status(403).json({ success: false, error: "Invalid user ID" });
  }
  next();
};

// Create new order
router.post("/:userId/create", authMiddleware, blockGuests, checkUserId, validateCreateOrder, orderController.createOrder);

// Get all orders for a user
router.get("/user/:userId", authMiddleware, checkUserId, orderController.getUserOrders);

// Admin: get all orders
router.get("/", authMiddleware, orderController.getAllOrders);

// Get order by ID (owner or admin can fetch — left open for now; add checks if needed)
router.get("/:orderId", authMiddleware, orderController.getOrderById);

// Update order status (admin)
router.put("/:orderId/status", authMiddleware, restrictTo("admin"), orderController.updateOrderStatus);

module.exports = router;
