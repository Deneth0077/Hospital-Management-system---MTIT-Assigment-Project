import axios from 'axios';

const API_URL = 'http://localhost:5001/api/notifications';

const NotificationService = {
    getNotifications: async (recipientId) => {
        try {
            const response = await axios.get(`${API_URL}/recipient/${recipientId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    },
    
    getSystemNotifications: async () => {
        try {
            const response = await axios.get(`${API_URL}/all`);
            return response.data;
        } catch (error) {
            console.error('Error fetching global notifications:', error);
            return [];
        }
    }
};

export default NotificationService;
