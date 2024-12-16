const express = require("express");
const router = express.Router();
const {
  createPlantReport,
  getPlantReports,
  getPlantDateRecord,
} = require("../controllers/plantReportController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new plant report
router.post("/", authMiddleware, createPlantReport);

// Get reports by plant ID and optional date
// router.get("/:plant_id", authMiddleware, getPlantReports);

// Get reports by plant zone, number, and date
router.get("/records", authMiddleware, getPlantDateRecord);

module.exports = router;
