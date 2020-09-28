"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mail_1 = __importDefault(require("../../lib/Mail"));
class RecoveryMail {
    get key() {
        return 'RecoveryMail';
    }
    async handle({ data }) {
        const { name, email } = data.user;
        const { token } = data;
        await Mail_1.default.sendMail({
            to: `${name} - <${email}>`,
            from: 'proffy@proffy.com.br',
            subject: 'Definir senha',
            template: 'recovery',
            context: {
                user: name,
                token
            },
        });
    }
}
exports.default = new RecoveryMail();
