"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMinutesToHour = exports.convertHourToMinutes = void 0;
function convertHourToMinutes(time) {
    const [hour, minutes] = time.split(':').map(Number);
    const timeInMinutes = (hour * 60) + minutes;
    // aqui estou transformando as horas em minutos.
    return timeInMinutes;
}
exports.convertHourToMinutes = convertHourToMinutes;
;
function convertMinutesToHour(time) {
    // convertendo minutos em horas;
    const hours = (time / 60);
    // retorna o menor número inteiro dentre o hour;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    // arredondando os minutos mais proximo do inteiro;
    const rminutes = Math.round(minutes);
    if (rhours.toString().length == 2) {
        return `${rhours}:${rminutes}0`;
    }
    if (rminutes.toString().length == 2) {
        return `0${rhours}:${rminutes}`;
    }
    return `0${rhours}:${rminutes}0`;
}
exports.convertMinutesToHour = convertMinutesToHour;
;
