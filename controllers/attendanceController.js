const pool = require("../config/db");

// Controller to handle attendance submission
exports.submitAttendance = async (req, res) => {
  const { user_id, full_name, phone_number, email, zone, vibhaag, work_types } =
    req.body;

  // Validate request
  if (!user_id || !work_types || work_types.length === 0) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const query = `
            INSERT INTO attendance (user_id, full_name, phone_number, email, zone, vibhaag, work_types)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
    const values = [
      user_id,
      full_name,
      phone_number,
      email,
      zone,
      vibhaag,
      work_types,
    ];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Attendance recorded successfully.",
      attendance: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error recording attendance." });
  }
};

// Add Attendance
exports.addAttendance = async (req, res) => {
  try {
    const {
      user_id,
      full_name,
      phone_number,
      email,
      zone,
      vibhaag,
      work_types,
    } = req.body;

    const date = new Date().toISOString().split("T")[0]; // Current date (YYYY-MM-DD)

    // Insert attendance record
    const query = `
        INSERT INTO attendance (date, user_id, full_name, phone_number, email, zone, vibhaag, work_types)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `;
    const values = [
      date,
      user_id,
      full_name,
      phone_number,
      email,
      zone,
      vibhaag,
      work_types,
    ];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Attendance recorded successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({ error: "Failed to add attendance." });
  }
};

// Get Attendance by Date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    // Fetch attendance records for the given date
    const query = `
        SELECT * FROM attendance WHERE date = $1 ORDER BY timestamp;
      `;
    const values = [date];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this date." });
    }

    res.status(200).json({ attendance: result.rows });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance records." });
  }
};
