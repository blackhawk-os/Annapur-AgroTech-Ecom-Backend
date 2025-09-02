
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

// POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, termsChecked } = req.body;

    if (!termsChecked) {
      return res.status(400).json({ success: false, error: "Terms must be accepted" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, error: "Email already in use" });
    }

    // split fullName
    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(" ");

    // enforce safe role on self-registration
    const safeRole = ["buyer", "farmer", "admin"].includes(role) ? role : "buyer";

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password, // hashed by pre-save
      role: safeRole,
      is_guest: false,
    });

    const tokenPayload = {
      id: user._id,
      fullName: `${user.firstName} ${user.lastName || ""}`.trim(),
      email: user.email,
      role: user.role,
    };

    const token = signToken(tokenPayload);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: tokenPayload,
      convertedFromGuest: false,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Registration failed", details: err.message });
  }
};

// POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const tokenPayload = {
      id: user._id,
      fullName: `${user.firstName} ${user.lastName || ""}`.trim(),
      email: user.email,
      role: user.role,
    };

    const token = signToken(tokenPayload);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: tokenPayload,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Login failed", details: err.message });
  }
};

// POST /api/auth/guest-login
exports.guestLogin = (req, res) => {
  try {
    const guestUser = {
      id: `guest_${Date.now()}`,
      fullName: "Guest User",
      email: `guest${Math.floor(Math.random() * 100000)}@example.com`,
      role: "guest",
    };

    const token = signToken(guestUser);

    return res.status(200).json({
      success: true,
      message: "Guest login successful",
      token,
      user: guestUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Guest login failed", details: error.message });
  }
};
