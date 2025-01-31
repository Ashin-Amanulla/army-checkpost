module.exports = {
    '/audit-logs': {
        get: {
            summary: 'Get audit logs',
            tags: ['Audit Logs'],
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
                    name: 'action',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    in: 'query',
                    name: 'module',
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'List of audit logs',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/AuditLog'
                                        }
                                    },
                                    pagination: {
                                        type: 'object',
                                        properties: {
                                            total: { type: 'number' },
                                            page: { type: 'number' },
                                            pages: { type: 'number' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/audit-logs/export': {
        get: {
            summary: 'Export audit logs',
            tags: ['Audit Logs'],
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
                }
            ],
            responses: {
                200: {
                    description: 'Excel file containing audit logs',
                    content: {
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                            schema: {
                                type: 'string',
                                format: 'binary'
                            }
                        }
                    }
                }
            }
        }
    }
}; 