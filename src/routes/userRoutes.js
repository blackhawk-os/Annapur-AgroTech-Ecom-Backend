const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, restrictTo } = require("../middleware/authMiddleware");
const { validateAddress, validateUpdateAddress } = require("../middleware/validateRequest");

// ==========================
// Helper middleware: check self or admin
// ==========================
const selfOrAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user._id.toString() === req.params.id) {
    return next();
  }
  return res.status(403).json({ success: false, error: "Forbidden" });
};

// ==========================
// USER ROUTES
// ==========================
router.get("/profile", authMiddleware, userController.getProfile);
router.get("/", authMiddleware, restrictTo("admin"), userController.getAllUsers);
router.get("/:id", authMiddleware, selfOrAdmin, userController.getUserById);
router.put("/:id", authMiddleware, selfOrAdmin, userController.updateUser);
router.delete("/:id", authMiddleware, restrictTo("admin"), userController.deleteUser);

// ==========================
// ADDRESS ROUTES
// ==========================
router.post("/:id/addresses", authMiddleware, selfOrAdmin, validateAddress, userController.addAddress);
router.get("/:id/addresses", authMiddleware, selfOrAdmin, userController.getAddresses);
router.get("/:id/addresses/default", authMiddleware, selfOrAdmin, userController.getDefaultAddress);
router.put("/:id/addresses/:addressId", authMiddleware, selfOrAdmin, validateUpdateAddress, userController.updateAddress);
router.delete("/:id/addresses/:addressId", authMiddleware, selfOrAdmin, userController.deleteAddress);
router.put("/:id/addresses/:addressId/default", authMiddleware, selfOrAdmin, userController.setDefaultAddress);

module.exports = router;
