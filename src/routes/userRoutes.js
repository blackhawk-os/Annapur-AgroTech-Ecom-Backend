
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");

// current profile
router.get("/profile", authMiddleware, userController.getProfile);

// admin
//router.get("/", authMiddleware, restrictTo("admin"), userController.getAllUsers);
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = router;
