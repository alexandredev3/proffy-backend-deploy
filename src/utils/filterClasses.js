"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterClasses = void 0;
const connection_1 = require("../database/connection");
const formatDate_1 = require("../utils/formatDate");
async function filterClasses(props) {
    const { isFindAll, time, week_day, subject } = props;
    const classes = await connection_1.db('classes')
        .whereExists(function () {
        // vai fazer que o schedule fique dentro do objeto do class.
        if (isFindAll) {
            return this.select('class_schedule.*')
                .from('class_schedule')
                .whereRaw('class_schedule.class_id = classes.id');
        }
        const timeInMinutes = formatDate_1.convertHourToMinutes(String(time));
        this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('class_schedule.class_id = classes.id')
            .whereRaw('class_schedule.week_day = ??', [Number(week_day)])
            .whereRaw('class_schedule.from <= ??', [timeInMinutes])
            .whereRaw('class_schedule.to > ??', [timeInMinutes]);
        return this.select('classes.*')
            .from('classes')
            .where('classes.subject', subject);
    })
        .join('users', 'classes.user_id', '=', 'users.id')
        .join('files', 'files.id', '=', 'users.avatar_id')
        .join('class_schedule', 'class_schedule.class_id', '=', 'classes.id')
        .select([
        'classes.*',
        'users.name', 'users.avatar_id', 'files.path',
        'class_schedule.*'
    ]);
    const classesList = classes === null || classes === void 0 ? void 0 : classes.map((item) => {
        const { id, avatar_id, name, bio, whatsapp, cost, subject, user_id, path, } = item;
        return {
            class: {
                id,
                user_id,
                name,
                avatar_url: avatar_id == null ? null : `http://${process.env.IMAGE_URL}/files/${path}`,
                subject,
                whatsapp,
                bio,
                cost,
            }
        };
    });
    const schedulesList = classes === null || classes === void 0 ? void 0 : classes.map((item) => {
        const { class_id, id, week_day, from, to } = item;
        return {
            schedule: {
                id,
                class_id,
                week_day,
                from: formatDate_1.convertMinutesToHour(from),
                to: formatDate_1.convertMinutesToHour(to)
            }
        };
    });
    return { classesList, schedulesList };
}
exports.filterClasses = filterClasses;
