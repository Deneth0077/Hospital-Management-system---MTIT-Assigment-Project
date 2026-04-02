const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://denethc545_db_user:wardpass123@ward-management-microse.rjldbui.mongodb.net/Lab_DB?retryWrites=true&w=majority&appName=Ward-Management-Microservice';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to Lab Management MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Lab Test Schema
const labTestSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    patient: { type: String, required: true },
    test: { type: String, required: true },
    type: { type: String, required: true },
    urgency: { type: String, enum: ['Stat', 'Routine'], default: 'Routine' },
    status: { type: String, enum: ['Pending', 'Processing', 'Done'], default: 'Pending' },
    reportUrl: { type: String, default: '#' },
    createdAt: { type: Date, default: Date.now }
});

const LabTest = mongoose.model('LabTest', labTestSchema);

// Seed some data if needed (optional)
const seedData = async () => {
    const count = await LabTest.countDocuments();
    if (count === 0) {
        await LabTest.insertMany([
            { id: "T-201", patient: "John Doe", test: "Complete Blood Count", type: "Hematology", urgency: "Stat", status: "Done", reportUrl: "#" },
            { id: "T-202", patient: "Alice Smith", test: "Urinalysis", type: "Biochemistry", urgency: "Routine", status: "Processing", reportUrl: "#" },
            { id: "T-203", patient: "Bob Johnson", test: "Chest X-Ray", type: "Radiology", urgency: "Stat", status: "Pending", reportUrl: "#" },
            { id: "T-204", patient: "Emma Wilson", test: "Glucose Fasting", type: "Biochemistry", urgency: "Routine", status: "Done", reportUrl: "#" },
        ]);
        console.log('Seed data inserted');
    }
};
seedData();

// Routes
// 1. Get all tests
app.get('/api/lab/tests', async (req, res) => {
    try {
        const tests = await LabTest.find().sort({ createdAt: -1 });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Add a new test
app.post('/api/lab/tests', async (req, res) => {
    console.log('Request body:', req.body);
    const test = new LabTest(req.body);
    try {
        const newTest = await test.save();
        res.status(201).json(newTest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. Update test status
app.patch('/api/lab/tests/:id', async (req, res) => {
    try {
        const updatedTest = await LabTest.findOneAndUpdate(
            { id: req.params.id },
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedTest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. Delete a test
app.delete('/api/lab/tests/:id', async (req, res) => {
    try {
        await LabTest.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Test deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Lab Management Service running on port ${PORT}`);
});
