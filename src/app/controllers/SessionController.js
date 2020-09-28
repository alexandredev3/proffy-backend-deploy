"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = require("../../database/connection");
const handlePassword_1 = require("../../utils/handlePassword");
const auth_1 = __importDefault(require("../../config/auth"));
class SessionController {
    async store(request, response) {
        const { email, password } = request.body;
        try {
            const user = await connection_1.db('users')
                .where('email', '=', email)
                .returning('*');
            if (!user[0]) {
                return response.status(400).json({
                    error: 'User does not exists!'
                });
            }
            const check_password = await handlePassword_1.passwordCompare(password, email);
            if (!check_password) {
                return response.status(401).json({
                    error: 'Password does not match!'
                });
            }
            const { id, name, avatar_id } = user[0];
            const avatar = await connection_1.db('files')
                .where('id', '=', avatar_id)
                .first();
            return response.json({
                user: {
                    id,
                    name,
                    avatar_url: avatar == null ? null : `http://${process.env.IMAGE_URL}/files/${avatar.path}`
                },
                token: jsonwebtoken_1.default.sign({ id }, auth_1.default.secret, {
                    expiresIn: auth_1.default.expiresIn
                })
            });
        }
        catch (err) {
            console.log(err);
            return response.status(400).json({
                error: 'Unexpected error while login.'
            });
        }
    }
}
exports.default = SessionController;
