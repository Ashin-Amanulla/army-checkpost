module.exports = {
    '/checkposts': {
        post: {
            summary: 'Create new checkpost',
            tags: ['Checkposts'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name', 'code', 'location'],
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'Name of the checkpost'
                                },
                                code: {
                                    type: 'string',
                                    description: 'Unique code for the checkpost'
                                },
                                location: {
                                    type: 'string',
                                    description: 'Location/address of the checkpost'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Checkpost created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Checkpost'
                            }
                        }
                    }
                },
                400: {
                    description: 'Invalid input'
                }
            }
        },
        get: {
            summary: 'Get all checkposts',
            tags: ['Checkposts'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'List of checkposts',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/Checkpost'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/checkposts/{id}': {
        put: {
            summary: 'Update checkpost',
            tags: ['Checkposts'],
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
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                code: { type: 'string' },
                                location: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Checkpost updated successfully'
                },
                404: {
                    description: 'Checkpost not found'
                }
            }
        },
        delete: {
            summary: 'Delete checkpost',
            tags: ['Checkposts'],
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
                    description: 'Checkpost deleted successfully'
                },
                404: {
                    description: 'Checkpost not found'
                }
            }
        }
    }
}; 