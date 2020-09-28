"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../../database/connection");
class TeachersCountController {
    async index(request, response) {
        try {
            const classes = await connection_1.db('classes')
                .count()
                .first();
            if (classes) {
                return response.json({ count: classes.count });
            }
            return response.json({ count: '0' });
        }
        catch (err) {
            return response.status(400).json({
                error: 'Sorry but it was not possible to count how many teachers there are on the platform'
            });
        }
    }
}
exports.default = TeachersCountController;
