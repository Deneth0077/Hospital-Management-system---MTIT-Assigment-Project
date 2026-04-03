const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// Basic CRUD
/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     responses:
 *       201:
 *         description: Appointment created
 */
router.post("/", appointmentController.createAppointment);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get("/", appointmentController.getAllAppointments);

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get appointment stats
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Analytics/Stats
 */
router.get("/stats", appointmentController.getAppointmentStats);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Appointment details
 */
router.get("/:id", appointmentController.getAppointmentById);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Appointment updated
 */
router.put("/:id", appointmentController.updateAppointment);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Appointment deleted
 */
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
