const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Adjust if using import

// Register User
exports.registerUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // Optional: extract guest token
    let guestPayload = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === "guest") {
          guestPayload = decoded;
        }
      } catch (err) {
        // Token is invalid or expired; ignore
      }
    }

    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      role,
      termsChecked,
    } = req.body;

    if (!fullName || !email || !phone || !password || !role || !termsChecked) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(" ");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
      is_guest: false, // explicitly a real user
    });

    await newUser.save();

    // Generate a new JWT for the real user
    const tokenPayload = {
      id: newUser._id,
      fullName: `${firstName} ${lastName}`,
      email: newUser.email,
      role: newUser.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: tokenPayload,
      convertedFromGuest: !!guestPayload,
    });
  } catch (err) {
    res.status(500).json({
      error: "Registration failed",
      details: err.message,
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const tokenPayload = {
      id: user._id,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: tokenPayload,
    });
  } catch (err) {
    res.status(500).json({
      error: "Login failed",
      details: err.message,
    });
  }
};

// Guest Login
exports.guestLogin = (req, res) => {
  try {
    const guestUser = {
      id: "guest_" + Date.now(),
      fullName: "Guest User",
      email: `guest${Math.floor(Math.random() * 100000)}@example.com`,
      role: "guest",
    };

    const token = jwt.sign(guestUser, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.status(200).json({
      message: "Guest login successful",
      token,
      user: guestUser,
    });
  } catch (error) {
    res.status(500).json({
      error: "Guest login failed",
      details: error.message,
    });
  }
};
