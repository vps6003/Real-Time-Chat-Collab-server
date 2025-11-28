// app.js or server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

// basic health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// connect DB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chat-app";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection error", err);
    process.exit(1);
  });
