
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");

// public
router.get("/allproducts", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);

// admin only
router.post("/addproduct", authMiddleware, productController.addProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.removeProduct);

module.exports = router;
