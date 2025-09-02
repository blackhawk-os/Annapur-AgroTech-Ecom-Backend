
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // guests do not exist in DB
    if (decoded.role === "guest") {
      req.user = { _id: decoded.id, role: "guest", email: decoded.email || null };
      return next();
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: "Forbidden" });
  }
  next();
};

const blockGuests = (req, res, next) => {
  if (req.user && req.user.role === "guest") {
    return res.status(403).json({ success: false, error: "Guests are not allowed for this action" });
  }
  next();
};

module.exports = { authMiddleware, restrictTo, blockGuests };
