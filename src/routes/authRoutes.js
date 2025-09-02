
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../middleware/validateRequest");

router.post("/register", validateRegister, authController.registerUser);
router.post("/login", validateLogin, authController.loginUser);
router.post("/guest-login", authController.guestLogin);

module.exports = router;
