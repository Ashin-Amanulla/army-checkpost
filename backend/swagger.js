const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Army Checkpost Vehicle Entry System API',
            version: '1.0.0',
            description: 'API documentation for Army Checkpost Vehicle Entry System',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 