module.exports = {
    '/vehicletypes': {
        post: {
            summary: 'Create new vehicle type',
            tags: ['Vehicle Types'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name', 'description'],
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'Name of the vehicle type'
                                },
                                description: {
                                    type: 'string',
                                    description: 'Description of the vehicle type'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Vehicle type created successfully'
                }
            }
        },
        get: {
            summary: 'Get all vehicle types',
            tags: ['Vehicle Types'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'List of vehicle types'
                }
            }
        }
    }
}; 