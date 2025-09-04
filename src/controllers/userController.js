const User = require("../models/User");

// GET /api/users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/users/:id (self or admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
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

    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, message: "User updated", user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/users/:id (admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/users/profile (current user)
exports.getProfile = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, error: "Unauthorized" });
    const user = await User.findById(req.user._id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ==========================
// ADDRESS MANAGEMENT
// ==========================

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, address, city, state, isDefault } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });


    if(!user.shippingAddresses){
        user.shippingAddresses =[];
    }
    if (isDefault && user.shippingAddresses.length > 0) {
      user.shippingAddresses = usershippingAddresses.map(addr => (addr.isDefault = false));
    }

    user.shippingAddresses.push({ label, address, city, state, isDefault: !!isDefault });
    await user.save();

    res.json({
      success: true,
      message: "Address added",
      addresses: user.shippingAddresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all addresses
exports.getAddresses = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("shippingAddresses");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.json({ success: true, addresses: user.shippingAddresses || [], });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get default address
exports.getDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("shippingAddresses");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const defaultAddress = user.shippingAddresses.find(addr => addr.isDefault) || null;

    res.json({ success: true, defaultAddress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    user.shippingAddresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();
    res.json({
      success: true,
      message: "Default address set",
      addresses: user.shippingAddresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update an existing address
exports.updateAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const { label, address, city, state, isDefault } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const addr = user.shippingAddresses.id(addressId);
    if (!addr) return res.status(404).json({ success: false, error: "Address not found" });

    if (isDefault) {
      user.shippingAddresses.forEach(a => (a.isDefault = false));
    }

    addr.label = label ?? addr.label;
    addr.address = address ?? addr.address;
    addr.city = city ?? addr.city;
    addr.state = state ?? addr.state;
    addr.isDefault = !!isDefault;

    await user.save();
    res.json({
      success: true,
      message: "Address updated",
      addresses: user.shippingAddresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    user.shippingAddresses = user.shippingAddresses.filter(addr => addr._id.toString() !== addressId);

    await user.save();
    res.json({
      success: true,
      message: "Address deleted",
      addresses: user.shippingAddresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};