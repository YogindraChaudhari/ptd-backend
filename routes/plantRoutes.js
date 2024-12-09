// const express = require("express");
// const multer = require("multer");
// const {
//   registerPlant,
//   updatePlant,
//   getPlantDetails,
//   deletePlant,
//   getPlantsByZone,
// } = require("../controllers/plantController");
// const authMiddleware = require("../middleware/authMiddleware"); // Ensures user is authenticated

// const router = express.Router();

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Specify the folder for saving images
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique filename using the current timestamp and original file name
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage }); // Use the custom storage configuration

// // Register a plant
// router.post(
//   "/register-plant",
//   authMiddleware,
//   upload.single("plant_image"), // Handle image upload
//   registerPlant
// );

// // Get plant details
// router.get("/get-plant", authMiddleware, getPlantDetails);

// // Get all plant details by zone (new endpoint)
// router.get("/zonewise", authMiddleware, getPlantsByZone); // Add this route

// // Update plant details
// router.put(
//   "/update-plant",
//   authMiddleware,
//   upload.single("plant_image"), // Handle image upload
//   updatePlant
// );

// // Delete a plant
// router.delete(
//   "/delete-plant",
//   authMiddleware, // Ensure the user is authenticated before deleting
//   deletePlant // Handle plant deletion
// );

// module.exports = router;

const express = require("express");
const multer = require("multer");
const {
  registerPlant,
  updatePlant,
  getPlantDetails,
  deletePlantByZone,
  deletePlant, // Import the delete function by zone
  getPlantsByZone,
  getAllPlants,
} = require("../controllers/plantController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Register a plant
router.post(
  "/register-plant",
  authMiddleware,
  upload.single("plant_image"),
  registerPlant
);

router.get("/get-map-plant", authMiddleware, getAllPlants);

// Get plant details
router.get("/get-plant", authMiddleware, getPlantDetails);

// Get all plant details by zone
router.get("/zonewise", authMiddleware, getPlantsByZone);

// Update plant details
router.put(
  "/update-plant",
  authMiddleware,
  upload.single("plant_image"),
  updatePlant
);

// Delete a plant by zone and plant number
router.delete(
  "/delete-zone-plant",
  authMiddleware,
  deletePlantByZone // Use deletePlantByZone function here
);
// Delete a plant by zone and plant number
router.delete(
  "/delete-plant",
  authMiddleware,
  deletePlant // Use deletePlantByZone function here
);

module.exports = router;
