
const loginAccount = (req, res) => {
    const { email, password } = req.body;

    // Hardcoded credentials
    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return res.status(200).json({
            message: "Login successful",
            token: "dummy-jwt-token",
            user: {
                email: ADMIN_EMAIL,
                role: "admin"
            }
        });
    } else {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }
};

module.exports = {
    loginAccount
};
