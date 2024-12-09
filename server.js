require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const plantRoutes = require("./routes/plantRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const path = require("path"); // Add path module

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/", authRoutes);
app.use("/plants", plantRoutes);
app.use("/attendance", attendanceRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
