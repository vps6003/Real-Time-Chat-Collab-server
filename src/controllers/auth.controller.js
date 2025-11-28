const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "hacker_is_an_asshole";

// Post Auth Register User
const registerUser = async (req, res) => {
  // console.log("Register Req Body:", req.body);
  try {
    const { userName, email, password } = req.body;
    //Chek if all fields are provided
    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ message: "userName, email, password required" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 chars" });
    }

    // Check if USer is aldready existing
    const existingUser = await User.findOne({ email }, { userName });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with similar Userame or Email!",
      });
    }

    //Hash Password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashed,
    });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("REGISTER_ERROR", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // don't leak which part failed
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("LOGIN_ERROR", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
