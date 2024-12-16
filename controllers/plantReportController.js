const pool = require("../config/db");

// Helper function to determine health status
const calculateHealthStatus = (answers) => {
  const {
    water_scheduled = false,
    fertilizers_applied = false,
    soil_level_maintained = false,
    compound_maintained = false,
    insects_present = false,
    unwanted_grass = false,
    water_logging = false,
    tree_burnt = false,
  } = answers;

  if (insects_present || unwanted_grass || water_logging || tree_burnt) {
    return "Infected";
  }

  if (
    water_scheduled &&
    fertilizers_applied &&
    soil_level_maintained &&
    compound_maintained
  ) {
    return "Good";
  }

  return "Infected"; // Default to Infected if conditions aren't met
};

// Create a new report
const createPlantReport = async (req, res) => {
  const userId = req.user.id;
  const {
    plant_number,
    plant_zone,
    water_scheduled,
    insects_present,
    fertilizers_applied,
    soil_level_maintained,
    tree_burnt,
    unwanted_grass,
    water_logging,
    compound_maintained,
    comments,
  } = req.body;

  console.log("Plant Number:", plant_number);
  console.log("Plant Zone:", plant_zone);

  if (!plant_number || !plant_zone) {
    return res
      .status(400)
      .json({ message: "Plant number and zone are required" });
  }

  const userResult = await pool.query(
    "SELECT full_name, phone_number FROM users WHERE id = $1",
    [userId]
  );
  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  //   const { full_name, user_zone, vibhaag } = userResult.rows[0];
  const { full_name, phone_number } = userResult.rows[0]; // From authMiddleware

  const health_status = calculateHealthStatus({
    water_scheduled,
    fertilizers_applied,
    soil_level_maintained,
    compound_maintained,
    insects_present,
    unwanted_grass,
    water_logging,
    tree_burnt,
  });

  try {
    const result = await pool.query(
      `INSERT INTO plant_reports 
                (plant_number, plant_zone, water_scheduled, insects_present, fertilizers_applied, soil_level_maintained, tree_burnt, unwanted_grass, water_logging, compound_maintained, comments, health_status, reported_by_full_name, reported_by_phone) 
             VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        plant_number,
        plant_zone,
        water_scheduled,
        insects_present,
        fertilizers_applied,
        soil_level_maintained,
        tree_burnt,
        unwanted_grass,
        water_logging,
        compound_maintained,
        comments,
        health_status,
        full_name,
        phone_number,
      ]
    );

    // Update health status in the plants table
    await pool.query(
      `UPDATE plants SET health_status = $1 WHERE plant_number = $2 AND plant_zone = $3`,
      [health_status, plant_number, plant_zone]
    );

    res.status(201).json({
      message: "Report submitted successfully",
      report: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error submitting report", error: err.message });
  }
};

// Get reports by plant ID and optional date
// const getPlantReports = async (req, res) => {
//   const { plant_id } = req.params;
//   const { date } = req.query;

//   try {
//     let query = `SELECT * FROM plant_reports WHERE plant_id = $1`;
//     const params = [plant_id];

//     if (date) {
//       query += ` AND DATE(report_date) = $2`;
//       params.push(date);
//     }

//     const result = await pool.query(query, params);
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Error fetching reports", error: err.message });
//   }
// };

// const getPlantReports = async (req, res) => {
//   const { zone, number } = req.params;

//   try {
//     let query = `SELECT * FROM plant_reports WHERE plant_zone = $1 AND plant_number = $2`;
//     const params = [zone, number];

//     const result = await pool.query(query, params);
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Error fetching reports", error: err.message });
//   }
// };

const getPlantDateRecord = async (req, res) => {
  const { zone, number, date } = req.query;

  if (!zone || !number || !date) {
    return res
      .status(400)
      .json({ message: "Please provide zone, number, and date!" });
  }

  try {
    const query = `
      SELECT * FROM plant_reports 
      WHERE plant_zone = $1 AND plant_number = $2 AND DATE(report_date) = $3;
    `;
    const params = [zone, number, date];
    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No reports found!" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching records", error: err.message });
  }
};

// module.exports = { createPlantReport, getPlantReports, getPlantDateRecord };
module.exports = { createPlantReport, getPlantDateRecord };
