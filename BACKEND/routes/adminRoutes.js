const express = require("express");
const router = express.Router();
const User = require("../models/User");


async function isAdmin(userId) {
  const user = await User.findById(userId);
  return user && user.role === "admin";
}

router.get("/users", async (req, res) => {
  try {
    const adminCheck = await isAdmin(req.headers["x-user-id"]);
    if (!adminCheck) {
      return res.status(403).json({ message: "Access denied." });
    }

    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;