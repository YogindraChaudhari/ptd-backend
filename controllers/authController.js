const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register user
const register = async (req, res) => {
  const { full_name, phone_number, email, zone, vibhaag, password } = req.body;
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE phone_number = $1 OR email = $2",
      [phone_number, email]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Phone number or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (full_name, phone_number, email, zone, vibhaag, password) VALUES ($1, $2, $3, $4, $5, $6)",
      [full_name, phone_number, email, zone, vibhaag, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user
const login = async (req, res) => {
  const { phone_number, password } = req.body;
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE phone_number = $1",
      [phone_number]
    );
    if (user.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or password" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or password" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user info
const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id; // From the JWT token attached by authMiddleware
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userResult.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user info" });
  }
};

module.exports = { register, login, getUserInfo };
