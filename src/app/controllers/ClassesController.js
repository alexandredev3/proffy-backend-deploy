"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../../database/connection");
const filterClasses_1 = require("../../utils/filterClasses");
class ClassesController {
    async show(request, response) {
        const filters = request.query;
        const subject = filters.subject;
        const week_day = filters.week_day;
        const time = filters.time;
        try {
            if (!filters.week_day || !filters.subject || !filters.time) {
                const classes = await filterClasses_1.filterClasses({ isFindAll: true });
                return response.json(classes);
            }
            const classes = await filterClasses_1.filterClasses({
                week_day, time, subject, isFindAll: false
            });
            if (!classes) {
                return response.status(400).json({
                    error: 'Sorry, no classes were found...'
                });
            }
            ;
            return response.json(classes);
        }
        catch (err) {
            console.log(err);
            return response.status(400).json({
                error: 'Unexpected error during class list.'
            });
        }
    }
    async create(request, response) {
        const { whatsapp, bio, subject, cost, } = request.body;
        const trx = await connection_1.db.transaction();
        try {
            const alreadyExistClass = await trx('classes')
                .where('user_id', '=', request.userId)
                .first();
            if (alreadyExistClass) {
                return response.status(400).json({
                    error: 'You already created a class, you can edit your class in the edit profile'
                });
            }
            const [classCreated] = await trx('classes')
                .insert({
                whatsapp,
                bio,
                subject,
                cost,
                user_id: request.userId
            })
                .returning("*");
            response.json(classCreated);
            return await trx.commit();
        }
        catch (err) {
            console.log(err);
            await trx.rollback();
            // se ocorrer alguma alteração no banco e cair nesse catch ele vai desfazer todas as operações.
            return response.status(400).json({
                error: 'Unexpected error while creating new class.'
            });
        }
        ;
    }
    async update(request, response) {
        const { whatsapp, bio, subject, cost } = request.body;
        try {
            const [classUpdated] = await connection_1.db('classes')
                .where('user_id', '=', request.userId)
                .update({
                whatsapp,
                bio,
                cost,
                subject,
            })
                .returning('*');
            return response.json(classUpdated);
        }
        catch (err) {
            console.log(err);
            return response.status(400).json({
                error: 'Unexpected error during class update.'
            });
        }
        ;
    }
    async delete(request, response) {
        await connection_1.db('classes')
            .where('user_id', '=', request.userId)
            .delete();
        return response.status(204).send();
    }
}
exports.default = ClassesController;
