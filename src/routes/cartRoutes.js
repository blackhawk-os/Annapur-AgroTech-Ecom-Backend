const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

//Get Users cart
router.get("/cart/:userId", cartController.getCart);

//Add item to the cart
router.post("/cart/:userId/add", cartController.addToCart);

//Update the item quantity
router.put("/cart/:userId/update/:itemId", cartController.updateCartItem);

//Remove item form the cart
router.delete("/cart/:userId/remove/:itemId", cartController.removeFromCart);

//Clear the entire cart
router.delete("/cart/:userId/clear", cartController.clearCart);

module.exports = router;
