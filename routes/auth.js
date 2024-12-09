const express = require("express");
const {
  register,
  login,
  getUserInfo,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users/me", authMiddleware, getUserInfo);

module.exports = router;
