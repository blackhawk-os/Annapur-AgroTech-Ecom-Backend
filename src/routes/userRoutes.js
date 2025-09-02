const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const auth = require("../middleware/auth"); // Add authentication middleware if needed

// User routes
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.get("/profile", userController.getProfile); //for  current user
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;