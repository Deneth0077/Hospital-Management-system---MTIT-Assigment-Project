const Medicine = require("../models/Medicine");

// Create a new medicine
exports.createMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json({
      success: true,
      data: medicine,
      message: "Medicine added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all medicines with optional filtering and search
exports.getAllMedicines = async (req, res) => {
  try {
    const { 
      category, 
      status, 
      search, 
      sort = "-createdAt" 
    } = req.query;
    
    let query = {};

    // Apply filters
    if (category) query.category = category;
    if (status) query.status = status;

    // Apply search on medicine name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { manufacturer: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    const medicines = await Medicine.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        error: "Medicine not found",
      });
    }
    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update medicine
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!medicine) {
      return res.status(404).json({
        success: false,
        error: "Medicine not found",
      });
    }
    res.status(200).json({
      success: true,
      data: medicine,
      message: "Medicine updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        error: "Medicine not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body;

    if (!quantity || !operation) {
      return res.status(400).json({
        success: false,
        error: "Quantity and operation are required",
      });
    }

    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        error: "Medicine not found",
      });
    }

    if (operation === "add") {
      medicine.stock += quantity;
    } else if (operation === "subtract") {
      if (medicine.stock < quantity) {
        return res.status(400).json({
          success: false,
          error: "Insufficient stock",
        });
      }
      medicine.stock -= quantity;
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid operation. Use 'add' or 'subtract'",
      });
    }

    await medicine.save();
    res.status(200).json({
      success: true,
      data: medicine,
      message: "Stock updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get medicines by category
exports.getMedicinesByCategory = async (req, res) => {
  try {
    const medicines = await Medicine.find({ category: req.params.category });
    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get low stock medicines
exports.getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ status: "Low-Stock" }).sort("-stock");
    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get out of stock medicines
exports.getOutOfStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ status: "Out-of-Stock" });
    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get pharmacy statistics
exports.getPharmacyStats = async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments();
    const inStock = await Medicine.countDocuments({ status: "In-Stock" });
    const lowStock = await Medicine.countDocuments({ status: "Low-Stock" });
    const outOfStock = await Medicine.countDocuments({ status: "Out-of-Stock" });
    
    const totalValue = await Medicine.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$stock", "$price"] } }
        }
      }
    ]);

    const categories = await Medicine.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMedicines,
        inStock,
        lowStock,
        outOfStock,
        totalInventoryValue: totalValue[0]?.totalValue || 0,
        medicineByCategory: categories,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
