const Appointment = require("../models/Appointment");

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({
      success: true,
      data: appointment,
      message: "Appointment scheduled successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all appointments with optional filtering and search
exports.getAllAppointments = async (req, res) => {
  try {
    const { 
        status, 
        doctorId, 
        patientId, 
        search, 
        type, 
        sort = "-appointmentDate" 
    } = req.query;
    
    let query = {};

    // Apply filters
    if (status) query.status = status;
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;
    if (type) query.type = type;

    // Apply search on patient name or reason
    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } },
        { doctorName: { $regex: search, $options: "i" } }
      ];
    }

    const appointments = await Appointment.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
};

// Get single appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Invalid Appointment ID",
    });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get stats for dashboard (elevating the premium feel)
exports.getAppointmentStats = async (req, res) => {
    try {
        const stats = await Appointment.aggregate([
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 }
                }
            }
        ]);

        const types = await Appointment.aggregate([
            {
                $group: {
                    _id: "$type",
                    total: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                byStatus: stats,
                byType: types
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
