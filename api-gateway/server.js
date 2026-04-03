const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(morgan('dev'));

// Define targets (Docker service names or localhost)
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://auth-backend:5000';
const WARD_SERVICE = process.env.WARD_SERVICE_URL || 'http://ward-service:8080';
const DOCTOR_SERVICE = process.env.DOCTOR_SERVICE_URL || 'http://doctor-service:8081';
const PATIENT_SERVICE = process.env.PATIENT_SERVICE_URL || 'http://patient-service:8082';
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:5001';
const APPOINTMENT_SERVICE = process.env.APPOINTMENT_SERVICE_URL || 'http://appointment-service:5002';
const LAB_SERVICE = process.env.LAB_SERVICE_URL || 'http://lab-service:5003';

// 0. Combined Swagger Documentation
const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
        urls: [
            { name: "Auth Service", url: "/api/auth/api-docs-json" },
            { name: "Ward Management", url: "/api-docs" }, // Spring boot default
            { name: "Patient Service", url: "/api/patients/api-docs-json" },
            { name: "Appointment Service", url: "/api/appointments/api-docs-json" },
            { name: "Lab Service", url: "/api/lab/api-docs-json" },
            { name: "Notification Service", url: "/api/notifications/api-docs-json" }
        ]
    }
};
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

// 1. Auth Service Proxy
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000
}));

// 2. Doctor Service Proxy
app.use('/api/doctors', createProxyMiddleware({
    target: DOCTOR_SERVICE,
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000
}));

// 3. Patient Service Proxy
app.use('/api/patients', createProxyMiddleware({
    target: PATIENT_SERVICE,
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000
}));

// 4. Ward Management Service Proxies (Excluding /api/patients)
const wardRoutes = ['/api/wards', '/api/beds', '/api/staff', '/api/schedules', '/api/admissions', '/api-docs'];
wardRoutes.forEach(route => {
    app.use(route, createProxyMiddleware({
        target: WARD_SERVICE,
        changeOrigin: true,
        timeout: 30000,
        proxyTimeout: 30000
    }));
});

// 5. Notification Service Proxy
app.use('/api/notifications', createProxyMiddleware({
    target: NOTIFICATION_SERVICE,
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000
}));

// 6. Appointment Service Proxy
app.use('/api/appointments', createProxyMiddleware({
    target: APPOINTMENT_SERVICE,
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000
}));

// 7. Lab Service Proxy
app.use('/api/lab', createProxyMiddleware({
    target: LAB_SERVICE,
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000
}));

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'API Gateway is running',
        services: {
            auth: AUTH_SERVICE,
            ward: WARD_SERVICE,
            doctor: DOCTOR_SERVICE,
            patient: PATIENT_SERVICE,
            notifications: NOTIFICATION_SERVICE,
            appointments: APPOINTMENT_SERVICE,
            lab: LAB_SERVICE
        }
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log(`- Auth Service -> ${AUTH_SERVICE}`);
    console.log(`- Ward Service -> ${WARD_SERVICE}`);
    console.log(`- Doctor Service -> ${DOCTOR_SERVICE}`);
    console.log(`- Patient Service -> ${PATIENT_SERVICE}`);
    console.log(`- Notification Service -> ${NOTIFICATION_SERVICE}`);
    console.log(`- Appointment Service -> ${APPOINTMENT_SERVICE}`);
    console.log(`- Lab Service -> ${LAB_SERVICE}`);
});
