const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: false,
    },
    doctorName: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    doctorId: {
      type: String,
      required: [true, "Doctor ID is required"],
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    timeSlot: {
        type: String,
        required: [true, "Time slot is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed", "In-Progress"],
      default: "Pending",
    },
    type: {
      type: String,
      enum: ["Routine Checkup", "Follow-up", "Emergency", "Consultation", "Surgery", "X-Ray/Lab"],
      default: "Routine Checkup",
    },
    severity: {
      type: String,
      enum: ["Low", "Moderate", "High", "Critical"],
      default: "Moderate",
    },
    reason: {
      type: String,
      required: [true, "Reason for appointment is required"],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
