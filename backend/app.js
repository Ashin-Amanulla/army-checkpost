const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./swagger');
const { connectDB } = require('./config/db');
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser');
require('dotenv').config();
// Import routes
const seedSuperAdmin = require('./seedSuperAdmin');
const authRoutes = require('./routes/auth.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const checkpostRoutes = require('./routes/checkpost.routes');
const vehicleTypeRoutes = require('./routes/vehicleType.routes');
const auditLogRoutes = require('./routes/auditLog.routes');
const reportRoutes = require('./routes/report.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userRoutes = require('./routes/user.routes');
const settingsRoutes = require('./routes/settings.routes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
    origin: ['https://chtconnect.in', 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  app.use(morgan('dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/checkposts', checkpostRoutes);
app.use('/api/vehicletypes', vehicleTypeRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// seedSuperAdmin();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// seedSuperAdmin();

module.exports = app;