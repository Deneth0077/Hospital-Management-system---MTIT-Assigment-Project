
const app = require('./src/app');
const dotenv = require('dotenv');

// Configure environment
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Endpoint available at http://localhost:${PORT}/api/auth/login`);
});
