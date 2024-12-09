const express = require("express");
const router = express.Router();
const {
  submitAttendance,
  addAttendance,
  getAttendanceByDate,
} = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");

// POST route to record attendance
// old route for attendance
// router.post("/atd", authMiddleware, submitAttendance);

// new route for attendance
router.post("/atd", authMiddleware, addAttendance);
router.get("/:date", authMiddleware, getAttendanceByDate);

module.exports = router;
