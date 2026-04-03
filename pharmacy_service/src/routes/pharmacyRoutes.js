const express = require("express");
const router = express.Router();
const pharmacyController = require("../controllers/pharmacyController");

// Basic CRUD
router.post("/", pharmacyController.createMedicine);
router.get("/", pharmacyController.getAllMedicines);
router.get("/stats", pharmacyController.getPharmacyStats); // Analytics
router.get("/category/:category", pharmacyController.getMedicinesByCategory);
router.get("/low-stock", pharmacyController.getLowStockMedicines);
router.get("/out-of-stock", pharmacyController.getOutOfStockMedicines);
router.get("/:id", pharmacyController.getMedicineById);
router.put("/:id", pharmacyController.updateMedicine);
router.put("/:id/stock", pharmacyController.updateStock); // Update stock
router.delete("/:id", pharmacyController.deleteMedicine);

module.exports = router;
