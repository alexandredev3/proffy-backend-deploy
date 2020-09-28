"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../../database/connection");
class ConnectionsController {
    async index(request, response) {
        const totalConnections = await connection_1.db('connections')
            .count('* as total')
            .returning("*");
        const { total } = totalConnections[0];
        return response.json({ total });
    }
    async create(request, response) {
        const { user_id } = request.body;
        await connection_1.db('connections').insert({
            user_id,
        }).returning("*");
        return response.status(201).send();
    }
}
exports.default = ConnectionsController;
