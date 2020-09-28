"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const date_fns_1 = require("date-fns");
const connection_1 = require("../../database/connection");
const handlePassword_1 = require("../../utils/handlePassword");
const Queue_1 = __importDefault(require("../../lib/Queue"));
class ResetPasswordController {
    async create(request, response) {
        const { email } = request.body;
        try {
            const user = await connection_1.db('users')
                .where('email', '=', email)
                .first();
            if (!user) {
                return response.status(400).json({ error: 'User does not exists' });
            }
            const token = crypto_1.default.randomBytes(20).toString('hex');
            // Tempo de expiração
            const now = new Date();
            now.setHours(now.getHours() + 1);
            // estou setando uma hora para o token expirar.
            await connection_1.db('reset_password')
                .where('user_id', '=', user.id)
                .delete();
            await connection_1.db('reset_password')
                .insert({
                password_reset_token: token,
                password_reset_token_expires: now,
                user_id: user.id
            });
            await Queue_1.default.add('RecoveryMail', {
                user, token
            });
            return response.status(204).send();
        }
        catch (err) {
            console.log(err);
            return response.status(400).json({
                error: 'Unexpected error while reset password.'
            });
        }
    }
    async update(request, response) {
        const { token } = request.params;
        const { password, confirmPassword } = request.body;
        const trx = await connection_1.db.transaction();
        try {
            const date = new Date();
            const reset_password = await trx('reset_password')
                .where('password_reset_token', '=', token)
                .first();
            if (!reset_password) {
                return response.status(400).json({
                    error: 'Token is invalid'
                });
            }
            if (reset_password.already_been_used) {
                return response.status(400).json({
                    error: 'Token is already been used'
                });
            }
            if (date_fns_1.isBefore(reset_password.password_reset_token_expires, date)) {
                return response.status(400).json({
                    error: 'Token is expires!'
                });
            }
            if (password !== confirmPassword) {
                return response.status(400).json({
                    error: 'Password and Confirm Password do not match.'
                });
            }
            const password_hash = await handlePassword_1.encryptsPassword(password);
            await trx('users')
                .where('id', '=', reset_password.user_id)
                .update({
                password_hash
            });
            await trx('reset_password')
                .where('password_reset_token', '=', token)
                .update({
                already_been_used: true
            });
            await trx.commit();
            return response.status(204).send();
        }
        catch (err) {
            await trx.rollback();
            return response.status(400).json({
                error: 'Unexpected error while reset password.'
            });
        }
    }
}
exports.default = ResetPasswordController;
