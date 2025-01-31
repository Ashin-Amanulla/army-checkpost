module.exports = {
    '/vehicles': {
        post: {
            summary: 'Create new vehicle entry',
            tags: ['Vehicles'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            required: [
                                'vehicleNumber',
                                'vehicleType',
                                'driverName',
                                'driverPhone',
                                'purpose',
                                'photo'
                            ],
                            properties: {
                                vehicleNumber: { type: 'string' },
                                vehicleType: { 
                                    type: 'string',
                                    description: 'Vehicle Type ID'
                                },
                                driverName: { type: 'string' },
                                driverPhone: { type: 'string' },
                                purpose: { type: 'string' },
                                photo: {
                                    type: 'string',
                                    format: 'binary'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Vehicle entry created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/VehicleEntry'
                            }
                        }
                    }
                }
            }
        },
        get: {
            summary: 'Get vehicle entries',
            tags: ['Vehicles'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: 'query',
                    name: 'startDate',
                    schema: {
                        type: 'string',
                        format: 'date'
                    }
                },
                {
                    in: 'query',
                    name: 'endDate',
                    schema: {
                        type: 'string',
                        format: 'date'
                    }
                },
                {
                    in: 'query',
                    name: 'vehicleType',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    in: 'query',
                    name: 'status',
                    schema: {
                        type: 'string',
                        enum: ['entered', 'exited']
                    }
                }
            ],
            responses: {
                200: {
                    description: 'List of vehicle entries',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/VehicleEntry'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/vehicles/{id}/exit': {
        put: {
            summary: 'Mark vehicle as exited',
            tags: ['Vehicles'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Vehicle exit recorded successfully'
                }
            }
        }
    }
}; 