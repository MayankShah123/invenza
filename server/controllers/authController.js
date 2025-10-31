const User = require("../model/userModel.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Helper function to generate a JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, full_name, company_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = new User({ email, password, full_name, company_name });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.full_name },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, name: user.full_name },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
