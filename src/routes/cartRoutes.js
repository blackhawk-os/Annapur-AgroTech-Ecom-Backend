
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authMiddleware, blockGuests } = require("../middleware/authMiddleware");
const { validateCartAdd, validateCartUpdate } = require("../middleware/validateRequest");

// Ensure the path here matches how you mount in index.js (mounted at /api/cart)

// Get user's cart
router.get("/:userId", authMiddleware, cartController.getCart);

// Add item
router.post("/:userId/add", authMiddleware, blockGuests, validateCartAdd, cartController.addToCart);

// Update item quantity by productId
router.put("/:userId/update/:productId", authMiddleware, blockGuests, validateCartUpdate, cartController.updateCartItem);

// Remove item by productId
router.delete("/:userId/remove/:productId", authMiddleware, blockGuests, cartController.removeFromCart);

// Clear entire cart
router.delete("/:userId/clear", authMiddleware, blockGuests, cartController.clearCart);

module.exports = router;
