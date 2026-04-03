const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5004;

// Start Server & Connect to DB
app.listen(PORT, () => {
    console.log(`Pharmacy Service running on port ${PORT}`);
    
    // Attempt DB connection in background to avoid blocking server startup
    connectDB().catch(err => {
        console.error("Database initialization failed:", err.message);
    });
});
