// routes/message.routes.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// GET /messages/:roomId (protected)
router.get("/:roomId", authMiddleware, messageController.getMessagesByRoomId);

module.exports = router;
