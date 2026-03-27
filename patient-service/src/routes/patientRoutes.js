const express = require("express");
const {
  registerPatient,
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
} = require("../controllers/patientController");

const router = express.Router();

router.post("/patients", registerPatient);
router.get("/patients", getAllPatients);
router.get("/patients/:id", getPatientById);
router.put("/patients/:id", updatePatientById);
router.delete("/patients/:id", deletePatientById);

module.exports = router;
