
import axios from 'axios';

const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000/api';

// 1. Auth Service (Node backend)
const api = axios.create({
    baseURL: GATEWAY_URL + '/auth',
});

// 2. Doctor Service
export const doctorApi = axios.create({
    baseURL: GATEWAY_URL, // Generic for now, gateway will route based on sub-path
});

export const doctorService = {
    getAllDoctors: (params) => doctorApi.get('/doctors', { params }),
    getDoctorById: (id) => doctorApi.get(`/doctors/${id}`),
    createDoctor: (data) => doctorApi.post('/doctors', data),
    updateDoctor: (id, data) => doctorApi.put(`/doctors/${id}`, data),
    deleteDoctor: (id) => doctorApi.delete(`/doctors/${id}`),
    getStats: () => doctorApi.get('/doctors/stats'),
};

// 3. Patient Service
export const patientApi = axios.create({
    baseURL: GATEWAY_URL,
});

// 4. Appointment Service
export const appointmentApi = axios.create({
    baseURL: GATEWAY_URL,
});

// 5. Ward Service
export const wardApi = axios.create({
    baseURL: GATEWAY_URL,
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

    // Admissions (Ward-specific Patients)
    getAllPatients: () => wardApi.get('/admissions'),
    admitPatient: (data) => wardApi.post('/admissions/admit', data),
    getPatientById: (id) => wardApi.get(`/admissions/${id}`),
    updatePatient: (id, data) => wardApi.put(`/admissions/${id}`, data),
    deletePatient: (id) => wardApi.delete(`/admissions/${id}`),
    dischargePatient: (id) => wardApi.post(`/admissions/${id}/discharge`),

    // Staff
    getAllStaff: () => wardApi.get('/staff'),
    getStaffByWard: (wardId) => wardApi.get(`/staff/by-ward/${wardId}`),
    createStaff: (data) => wardApi.post('/staff', data),
    updateStaff: (id, data) => wardApi.put(`/staff/${id}`, data),
    deleteStaff: (id) => wardApi.delete(`/staff/${id}`),
    // Schedules
    getAllSchedules: () => wardApi.get('/schedules'),
};

export const appointmentService = {
    getAllAppointments: (params) => appointmentApi.get('/appointments', { params }),
    getAppointmentById: (id) => appointmentApi.get(`/appointments/${id}`),
    createAppointment: (data) => appointmentApi.post('/appointments', data),
    updateAppointment: (id, data) => appointmentApi.put(`/appointments/${id}`, data),
    deleteAppointment: (id) => appointmentApi.delete(`/appointments/${id}`),
    getStats: () => appointmentApi.get('/appointments/stats'),
};

// 6. Pharmacy Service
export const pharmacyApi = axios.create({
    baseURL: import.meta.env.VITE_PHARMACY_API_URL || 'http://localhost:8084/api',
});

// 7. Lab Service
export const labApi = axios.create({
    baseURL: GATEWAY_URL,
});

export const labService = {
    getAllTests: () => labApi.get('/lab/tests'),
    createTest: (data) => labApi.post('/lab/tests', data),
    updateTestStatus: (id, status) => labApi.patch(`/lab/tests/${id}`, { status }),
    deleteTest: (id) => labApi.delete(`/lab/tests/${id}`),
};

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
