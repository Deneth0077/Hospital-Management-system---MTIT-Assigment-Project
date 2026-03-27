
import axios from 'axios';

// 1. Auth Service (Node backend)
const api = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api',
});

// 2. Doctor Service
export const doctorApi = axios.create({
    baseURL: import.meta.env.VITE_DOCTOR_API_URL || 'http://localhost:8081/api',
});

// 3. Patient Service
export const patientApi = axios.create({
    baseURL: import.meta.env.VITE_PATIENT_API_URL || 'http://localhost:8082/api',
});

// 4. Appointment Service
export const appointmentApi = axios.create({
    baseURL: import.meta.env.VITE_APPOINTMENT_API_URL || 'http://localhost:8083/api',
});

// 5. Ward Service
export const wardApi = axios.create({
    baseURL: import.meta.env.VITE_WARD_API_URL || 'http://localhost:8080/api',
});

export const wardService = {
    // Wards
    getAllWards: () => wardApi.get('/wards'),
    getWardById: (id) => wardApi.get(`/wards/${id}`),
    createWard: (data) => wardApi.post('/wards', data),
    updateWard: (id, data) => wardApi.put(`/wards/${id}`, data),
    deleteWard: (id) => wardApi.delete(`/wards/${id}`),

    // Beds
    getAllBeds: () => wardApi.get('/beds'),
    getBedsByWard: (wardId) => wardApi.get(`/beds/by-ward/${wardId}`),
    createBed: (data) => wardApi.post('/beds', data),
    updateBed: (id, data) => wardApi.put(`/beds/${id}`, data),

    // Patients
    getAllPatients: () => wardApi.get('/patients'),
    admitPatient: (data) => wardApi.post('/patients/admit', data),
    getPatientById: (id) => wardApi.get(`/patients/${id}`),
    updatePatient: (id, data) => wardApi.put(`/patients/${id}`, data),
    deletePatient: (id) => wardApi.delete(`/patients/${id}`),

    // Staff
    getAllStaff: () => wardApi.get('/staff'),
    getStaffByWard: (wardId) => wardApi.get(`/staff/by-ward/${wardId}`),
    createStaff: (data) => wardApi.post('/staff', data),
    updateStaff: (id, data) => wardApi.put(`/staff/${id}`, data),
    deleteStaff: (id) => wardApi.delete(`/staff/${id}`),
    // Schedules
    getAllSchedules: () => wardApi.get('/schedules'),
};

// 6. Pharmacy Service
export const pharmacyApi = axios.create({
    baseURL: import.meta.env.VITE_PHARMACY_API_URL || 'http://localhost:8084/api',
});

// 7. Lab Service
export const labApi = axios.create({
    baseURL: import.meta.env.VITE_LAB_API_URL || 'http://localhost:8085/api',
});

// Admin Login handling
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network error' };
    }
};

export default api;
