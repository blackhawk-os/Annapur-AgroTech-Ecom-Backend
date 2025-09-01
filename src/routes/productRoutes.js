const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Different routes for products
router.get("/allproducts", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
router.post("/addproduct", productController.addProduct);
router.put("/updateproduct", productController.updateProduct);
router.delete("/removeproduct", productController.removeProduct);

module.exports = router;