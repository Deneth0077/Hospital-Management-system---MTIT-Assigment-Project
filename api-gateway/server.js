const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(morgan('dev'));

// Define targets (Docker service names or localhost)
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://auth-backend:5000';
const WARD_SERVICE = process.env.WARD_SERVICE_URL || 'http://ward-service:8080';
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:5001';

// 1. Auth Service Proxy
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/api/auth' } // Keep the same
}));

// 2. Ward Management Service Proxies (Multiple routes)
const wardRoutes = ['/api/wards', '/api/patients', '/api/beds', '/api/staff', '/api/schedules'];
wardRoutes.forEach(route => {
    app.use(route, createProxyMiddleware({
        target: WARD_SERVICE,
        changeOrigin: true
    }));
});

// 3. Notification Service Proxy
app.use('/api/notifications', createProxyMiddleware({
    target: NOTIFICATION_SERVICE,
    changeOrigin: true
}));

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'API Gateway is running',
        services: {
            auth: AUTH_SERVICE,
            ward: WARD_SERVICE,
            notifications: NOTIFICATION_SERVICE
        }
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log(`- Auth Service -> ${AUTH_SERVICE}`);
    console.log(`- Ward Service -> ${WARD_SERVICE}`);
    console.log(`- Notification Service -> ${NOTIFICATION_SERVICE}`);
});
