// middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "hacker_is_an_asshole";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expected: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch (err) {
    console.error("JWT_ERROR", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
