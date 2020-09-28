"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../../database/connection");
class FileController {
    async index(request, response) {
        const { id } = request.params;
        if (!id) {
            return response.status(400).json({
                error: 'Please inform the id'
            });
        }
        try {
            const image = await connection_1.db('files')
                .where('id', '=', id)
                .select('files.path')
                .first();
            if (!image) {
                return response.status(400).json({ error: 'This file does not exists' });
            }
            return response.json({
                image_url: `http://${process.env.IMAGE_URL}/files/${image.path}`
            });
        }
        catch (err) {
            return response.status(400).json({
                error: 'Unexpected error during list an file.'
            });
        }
    }
    async create(request, response) {
        const { originalname: name, filename: path } = request.file;
        const trx = await connection_1.db.transaction();
        try {
            const file = await trx('files').insert({
                name,
                path
            }).returning("*");
            const image = file[0];
            await trx('users')
                .where('id', '=', request.userId)
                .update({ avatar_id: image.id });
            await trx.commit();
            return response.json({
                id: image.id,
                avatar_url: `http://${process.env.IMAGE_URL}/files/${image.path}`
            });
        }
        catch (err) {
            await trx.rollback();
            console.log(err);
            return response.status(400).json({
                error: 'Unexpected error during create file.'
            });
        }
    }
}
exports.default = FileController;
