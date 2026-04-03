# 🏥 Hospital Management System (HMS) - Microservices Architecture

Welcome to the **Hospital Management System**, a robust and scalable health information system built using a state-of-the-art microservices architecture. This system is designed to streamline various hospital operations, from patient registration and automated ward management to doctor schedules, laboratory test tracking, and pharmacy inventory control.

## 🌟 Key Features

- **🌐 Unified API Gateway**: A central entry point for all frontend requests, managing routing, security, and consolidated API documentation.
- **⚕️ Integrated Microservices**: 9+ specialized services communicating over a shared Docker network.
- **💉 Automated Ward Management**: Built with Java/Spring Boot for handling wards, bed occupancy, and nurse/doctor staffing.
- **🧬 Comprehensive Laboratory Service**: Node.js-based service for managing test requests and reporting.
- **💊 Pharmacy Inventory**: Full inventory system for tracking medicines, stock levels, and expiry alerts.
- **📅 Appointment Scheduling**: Real-time management of doctor appointments.
- **🤝 Centralized Patient Records**: A single source of truth for patient admissions and history.
- **🔔 Real-time Notifications**: Triggered alerts for bed availability and critical stock levels.
- **🎨 Modern Dashboards**: Vibrant React-based interface with glassmorphism aesthetics and smooth transitions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Lucide Icons, Tailwind-inspired Vanilla CSS |
| **Backend** | Node.js (Express), Java (Spring Boot) |
| **Architecture** | Microservices, API Gateway, Docker, Docker-compose |
| **Database** | MongoDB Atlas (Cloud) |
| **API Documentation** | Swagger (OpenAPI 3.0) |

---

## 🏗️ System Components & API Endpoints

All endpoints are accessible through the **API Gateway** on port `8000`.

### 1. 📂 API Gateway (Port: 8000)
The gateway handles all external traffic and proxies requests to internal microservices.
- **Main Documentation**: `http://localhost:8000/swagger`
- **External URL**: `http://localhost:8000/api`

### 2. 🛌 Ward Management Service (Port: 8080)
Spring Boot service for complex ward and resource allocation logic. This is the core engine for on-site patient care.
- **Key Modules**:
    - **Patient Admission**: Automates the process of assigning patients to available beds based on ward capacity.
    - **Bed Tracking**: Real-time monitoring of bed status (Available, Occupied, Maintenance).
    - **Staff Scheduling**: Manages nurse and doctor shift rosters and ward assignments.
    - **Discharge Management**: Handles the checkout process and automatically frees up resources.
- **Endpoints**:
    - `POST /api/admissions/admit`: Automated patient admission and bed assignment.
    - `POST /api/admissions/{id}/discharge`: Process discharge and release bed.
    - `GET /api/admissions`: View all admitted patients.
    - `GET /api/wards`: List all hospital wards and their base configuration.
    - `POST /api/wards`: Define new wards (ICU, Maternity, Pediatrics, etc.).
    - `GET /api/beds/by-ward/{id}`: Detailed bed occupancy map for a specific ward.
    - `GET /api/staff`: Manage nurses, doctors, and medical assistants.
    - `GET /api/staff/by-ward/{id}`: View medical team for a specific ward.
    - `GET /api/schedules`: Monitor staff shifts and duty timelines.
- **Swagger**: `http://localhost:8080/api-docs`

### 3. 💊 Pharmacy Service (Port: 5004)
Manages medicine inventory, stock labels, and category-based filtering.
- **Key Modules**:
    - **Inventory Control**: Real-time stock level tracking.
    - **Automatic Status**: Self-updating status (In-Stock, Low-Stock, Out-of-Stock) based on reorder levels.
    - **Analytics**: Calculates inventory value and category distribution.
- **Endpoints**:
    - `GET /api/pharmacy`: Get all medicines
    - `POST /api/pharmacy`: Add new medicine
    - `GET /api/pharmacy/stats`: Get inventory analytics
    - `GET /api/pharmacy/low-stock`: Get medicines nearing depletion
    - `PUT /api/pharmacy/{id}/stock`: Update stock quantity (Add/Subtract)
- **Swagger**: `http://localhost:5004/api/pharmacy/api-docs`

### 4. 🧪 Lab Management Service (Port: 5003)
Handles laboratory test requests and results update.
- **Endpoints**:
    - `GET /api/lab/tests`: View all test requests
    - `POST /api/lab/tests`: Create new lab test request
    - `PATCH /api/lab/tests/{id}`: Update test status (Pending/Processing/Done)
    - `DELETE /api/lab/tests/{id}`: Cancel/Delete test request
- **Swagger**: `http://localhost:5003/api/lab/api-docs`

### 5. 👨‍⚕️ Doctor Service (Port: 8081)
Manages doctor profiles, specializations, and availability.
- **Endpoints**:
    - `GET /api/doctors`: List of all registered doctors
    - `POST /api/doctors`: Add new doctor profile
    - `PUT /api/doctors/{id}`: Update experience or availability
- **Swagger**: `http://localhost:8081/swagger-ui.html`

### 6. 📅 Appointment Service (Port: 5002)
Facilitates booking and managing patient visits.
- **Endpoints**:
    - `GET /api/appointments`: View all bookings
    - `POST /api/appointments`: Schedule new appointment
    - `GET /api/appointments/stats`: View daily appointment counts
- **Swagger**: `http://localhost:5002/api/appointments/api-docs`

### 7. 🔔 Notification Service (Port: 5001)
Centralized logging and dispatching of system alerts.
- **Endpoints**:
    - `POST /api/notifications/notify`: Send/Log a new system notification.
    - `GET /api/notifications/recipient/{id}`: Fetch alerts for a specific patient/staff.
    - `GET /api/notifications/all`: View most recent system alerts.
- **Swagger**: `http://localhost:5001/api/notifications/api-docs`

### 8. 🔑 Auth Service (Port: 5000)
Secure administrative login and authentication.
- **Endpoints**:
    - `POST /api/auth/login`: Admin authentication endpoint.
- **Default Credentials**: `admin@gmail.com` / `admin123`

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Desktop installed.
- Node.js (for local development).

### Installation & Run
1.  Clone the repository.
2.  Ensure you have a `.env` file in the root or relevant service folders with the MongoDB Atlas URI.
3.  Execute the following command in the project root:
    ```bash
    docker-compose up --build
    ```
4.  Wait for all services to start. The frontend will be available at `http://localhost:5173`.

### 📚 Development Mode (URLs)
Access the following dashboards directly for testing:
- **Frontend App**: `http://localhost:5173`
- **Combined Swagger**: `http://localhost:8000/swagger`

---

## 🔒 Security Note
This project uses a shared MongoDB Atlas connection. Avoid committing your credentials to Version Control. Change passwords periodically for database security.

---
© 2026 Hospital Management System - MTIT Assignment Project
