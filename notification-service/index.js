const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notification Service API',
            version: '1.0.0',
            description: 'API documentation for Notification Service',
        },
        servers: [{ url: 'http://localhost:5001' }, { url: '/api/notifications' }]
    },
    apis: ['./index.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api/notifications/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/api/notifications/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection (Use existing Atlas or a local one)
// For simplicity, I'll allow an env for the URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notification_db';

mongoose.connect(MONGODB_URI).then(() => {
    console.log('✅ Notification Service connected to MongoDB Atlas');
}).catch(err => {
    console.error('❌ Failed to connect to MongoDB. URI:', MONGODB_URI.split('@')[1]); // Log only the cluster part for safety
    console.error('Error Details:', err.message);
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., ADMISSION, DISCHARGE, SCHEDULE
    recipient: { type: String, required: true }, // e.g., Patient ID or Staff ID
    message: { type: String, required: true },
    sender: { type: String, default: 'System' },
    status: { type: String, enum: ['SENT', 'PENDING', 'FAILED'], default: 'SENT' },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

// Routes
/**
 * @swagger
 * /notify:
 *   post:
 *     summary: Send a notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type: { type: string }
 *               recipient: { type: string }
 *               message: { type: string }
 *               sender: { type: string }
 *     responses:
 *       201:
 *         description: Notification processed
 */
app.post('/api/notifications/notify', async (req, res) => {
    try {
        const { type, recipient, message, sender } = req.body;

        if (!type || !recipient || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newNotification = new Notification({
            type,
            recipient,
            message,
            sender
        });

        await newNotification.save();

        console.log(`[Notification Sent] To: ${recipient}, Type: ${type}, Message: ${message}`);

        // Here we could integrate real email/SMS/Socket.io
        
        return res.status(201).json({
            message: 'Notification processed successfully',
            notification: newNotification
        });
    } catch (error) {
        console.error('Error processing notification:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /recipient/{id}:
 *   get:
 *     summary: Get notifications for a specific recipient
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of notifications
 */
app.get('/api/notifications/recipient/:id', async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.params.id }).sort({ createdAt: -1 });
        return res.json(notifications);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /all:
 *   get:
 *     summary: Get all recent notifications
 *     responses:
 *       200:
 *         description: List of all notifications
 */
app.get('/api/notifications/all', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
        return res.json(notifications);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'Notification Service is up and running' });
});

app.listen(PORT, () => {
    console.log(`Notification service running on port ${PORT}`);
});
