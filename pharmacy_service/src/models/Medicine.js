const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    medicineId: {
      type: String,
      required: [true, "Medicine ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Antibiotic", "Analgesic", "Anti-inflammatory", "Antihistamine", "Cardiovascular", "Respiratory", "Gastrointestinal", "Other"],
      default: "Other"
    },
    description: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, "Unit of measurement is required"],
      enum: ["Tablets", "Capsules", "Liquid", "Injection", "Cream", "Gel", "Powder"],
      default: "Tablets"
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["In-Stock", "Low-Stock", "Out-of-Stock"],
      default: "In-Stock",
    },
    reorderLevel: {
      type: Number,
      default: 50,
    },
    sideEffects: {
      type: String,
      trim: true,
    },
    dosage: {
      type: String,
      trim: true,
    },
    usageInstructions: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Automatically update status based on stock level
medicineSchema.pre("save", function (next) {
  if (this.stock === 0) {
    this.status = "Out-of-Stock";
  } else if (this.stock <= this.reorderLevel) {
    this.status = "Low-Stock";
  } else {
    this.status = "In-Stock";
  }
  next();
});

module.exports = mongoose.model("Medicine", medicineSchema);
