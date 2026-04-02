const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// Basic CRUD
router.post("/", appointmentController.createAppointment);
router.get("/", appointmentController.getAllAppointments);
router.get("/stats", appointmentController.getAppointmentStats); // Analytics
router.get("/:id", appointmentController.getAppointmentById);
router.put("/:id", appointmentController.updateAppointment);
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
