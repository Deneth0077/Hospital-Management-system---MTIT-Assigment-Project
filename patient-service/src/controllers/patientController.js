const mongoose = require("mongoose");
const Patient = require("../models/Patient");

const requiredFields = [
  "fullName",
  "age",
  "gender",
  "phone",
  "email",
  "address",
  "bloodGroup",
  "dateOfBirth",
  "emergencyContactName",
  "emergencyContactPhone",
];

const registerPatient = async (req, res, next) => {
  try {
    // Simple required-field validation for clear assignment-friendly messages.
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        data: null,
      });
    }

    const patient = await Patient.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      data: patients,
    });
  } catch (error) {
    return next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent app crash on invalid MongoDB ObjectId.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
        data: null,
      });
    }

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient fetched successfully",
      data: patient,
    });
  } catch (error) {
    return next(error);
  }
};

const updatePatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
        data: null,
      });
    }

    const patient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    return next(error);
  }
};

const deletePatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
        data: null,
      });
    }

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
      data: patient,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerPatient,
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
};
