const authPaths = require('./paths/auth.swagger');
const vehiclePaths = require('./paths/vehicle.swagger');
const checkpostPaths = require('./paths/checkpost.swagger');
const vehicleTypePaths = require('./paths/vehicleType.swagger');
const auditLogPaths = require('./paths/auditLog.swagger');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Army Checkpost API Documentation',
        version: '1.0.0',
        description: 'API documentation for Army Checkpost Vehicle Entry System'
    },
    servers: [
        {
            url: process.env.API_URL || 'http://localhost:5000/api',
            description: 'API Server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    paths: {
        ...authPaths,
        ...vehiclePaths,
        ...checkpostPaths,
        ...vehicleTypePaths,
        ...auditLogPaths
    }
};

module.exports = swaggerDefinition; 