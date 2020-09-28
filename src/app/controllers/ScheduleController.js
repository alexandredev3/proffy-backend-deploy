"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../../database/connection");
const formatDate_1 = require("../../utils/../utils/formatDate");
class ScheduleController {
    async index(request, response) {
        const classes = await connection_1.db('classes')
            .where('user_id', '=', request.userId)
            .first();
        const class_id = classes.id;
        const schedules = await connection_1.db('class_schedule')
            .where('class_id', '=', class_id);
        return response.json(schedules);
    }
    async create(request, response) {
        const { schedule } = request.body;
        const trx = await connection_1.db.transaction();
        try {
            const insertedClassesIds = await trx('classes')
                .where('user_id', '=', request.userId)
                .returning("*");
            const class_id = insertedClassesIds[0].id;
            const classSchedule = schedule.map((scheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: formatDate_1.convertHourToMinutes(scheduleItem.from),
                    to: formatDate_1.convertHourToMinutes(scheduleItem.to)
                };
            });
            const scheduleFields = await trx('class_schedule')
                .insert(classSchedule)
                .returning("*");
            await trx.commit();
            return response.json(scheduleFields);
        }
        catch (err) {
            await trx.rollback();
            console.log(err);
            return response.status(400).json({
                error: 'Unexpected error while creating new Schedule.'
            });
        }
    }
    async update(request, response) {
        const { week_day, from, to } = request.body;
        const { id } = request.params;
        if (!id) {
            return response.status(400).json({
                error: 'undefined id'
            });
        }
        const trx = await connection_1.db.transaction();
        try {
            const class_schedule = await trx('class_schedule')
                .where('id', '=', id)
                .first();
            const classes = await trx('classes')
                .where('user_id', '=', request.userId)
                .first();
            if (class_schedule.class_id !== classes.id) {
                return response.status(401).json({
                    error: 'Action not allowed!'
                });
            }
            const schedule = await trx('class_schedule')
                .where('id', '=', id)
                .update({
                week_day,
                from: formatDate_1.convertHourToMinutes(from),
                to: formatDate_1.convertHourToMinutes(to)
            })
                .returning("*");
            await trx.commit();
            return response.json(schedule);
        }
        catch (err) {
            await trx.rollback();
            console.log(err);
            return response.status(400).json({
                error: 'Unexpected error while updating an Schedule.'
            });
        }
    }
    async delete(request, response) {
        const { id } = request.params;
        try {
            const class_schedule = await connection_1.db('class_schedule')
                .where('id', '=', id)
                .first();
            const classes = await connection_1.db('classes')
                .where('user_id', '=', request.userId)
                .first();
            if (!class_schedule) {
                return response.status(400).json({
                    error: 'Schedule does not exists'
                });
            }
            if (class_schedule.class_id !== classes.id) {
                return response.status(401).json({
                    error: 'Action not allowed!'
                });
            }
            await connection_1.db('class_schedule')
                .where('id', '=', id)
                .delete();
            return response.status(204).send();
        }
        catch (err) {
            console.log(err);
            return response.status(400).json({
                error: 'Unexpected error while delete an Schedule.'
            });
        }
    }
}
exports.default = ScheduleController;
