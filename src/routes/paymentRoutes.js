const express = require("express");
const router = express.Router();
const {
  initiateEsewaPayment,
  verifyEsewaPayment,
} = require("../controllers/paymentController");

console.log("✅ paymentRoutes loaded");

// Initiate Esewa payment
router.post("/esewa", initiateEsewaPayment);

// Success callback
router.get("/esewa-success", verifyEsewaPayment);

// Optional: simple test route to verify router works
router.get("/test-success", (req, res) => {
  console.log("✅ /test-success route hit");
  res.send("Test route works");
});

// Failure callback
router.get("/esewa-failure", (req, res) => {
  console.log("✅ /esewa-failure route hit");
  res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
});

module.exports = router;
