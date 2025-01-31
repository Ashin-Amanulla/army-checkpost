const validateRegister = async (req, res, next) => {
    try {
        const { username, password, fullName, role, checkpost } = req.body;

        // Validate required fields
        if (!username || !password || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, password and full name'
            });
        }

        // Validate username
        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters long'
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Validate role
        const validRoles = ['user', 'admin', 'super_admin'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }

        // Validate checkpost for users
        if ((role === 'user' || !role) && !checkpost) {
            return res.status(400).json({
                success: false,
                message: 'Checkpost is required for users'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const validateLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    validateRegister,
    validateLogin
}; 