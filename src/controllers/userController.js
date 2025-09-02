
const User = require("../models/User");

// GET /api/users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/users/:id (self or admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/users/:id (self or admin) - whitelist fields
exports.updateUser = async (req, res) => {
  try {
    const allowed = ["firstName", "lastName", "phone"];
    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, message: "User updated", user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/users/:id (admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/users/profile (current user)
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
    const user = await User.findById(req.user._id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
