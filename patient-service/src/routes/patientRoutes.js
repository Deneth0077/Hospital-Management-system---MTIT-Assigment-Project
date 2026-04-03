const express = require("express");
const {
  registerPatient,
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
} = require("../controllers/patientController");

const router = express.Router();

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Register a new patient
 *     tags: [Patients]
 *     responses:
 *       201:
 *         description: Patient created successfully
 */
router.post("/patients", registerPatient);

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get("/patients", getAllPatients);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient details
 */
router.get("/patients/:id", getPatientById);

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 */
router.put("/patients/:id", updatePatientById);

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 */
router.delete("/patients/:id", deletePatientById);

module.exports = router;
