// controllers/message.controller.js
const Message = require("../models/Message");

exports.getMessagesByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 }) // oldest first
      .populate("sender", "userName email");

    return res.status(200).json({ messages });
  } catch (err) {
    console.error("GET_MESSAGES_ERROR", err);
    return res.status(500).json({ message: "Server error" });
  }
};
