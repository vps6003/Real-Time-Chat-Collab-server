// models/Message.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    // User who sent it
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Room / channel (optional if you support DMs)
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    // Optional: message type (text/image/file/etc.)
    type: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
    },

    // Users who have read the message
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Message", messageSchema);
