"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../../database/connection");
class ClassesListController {
    async index(request, response) {
        const classes = await connection_1.db('classes')
            .where('user_id', '=', request.userId)
            .first();
        if (!classes) {
            return response.status(400).json({
                error: 'This user has no class registered'
            });
        }
        return response.json(classes);
    }
}
exports.default = ClassesListController;
