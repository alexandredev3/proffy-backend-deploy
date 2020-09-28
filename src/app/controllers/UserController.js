"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../../database/connection");
const handlePassword_1 = require("../../utils/handlePassword");
class UserController {
    async store(request, response) {
        const { name, surname, email, password, confirmPassword } = request.body;
        try {
            const user = await connection_1.db('users').where('email', '=', email).returning('*');
            const password_hash = await handlePassword_1.encryptsPassword(password);
            if (user[0]) {
                return response.status(400).json({ message: 'User already exists!' });
            }
            if (password !== confirmPassword) {
                return response.status(400).json({
                    error: 'password does not match'
                });
            }
            const nameAndSurname = name + ' ' + surname;
            await connection_1.db('users').insert({
                name: nameAndSurname,
                email,
                password_hash
            });
            return response.status(204).send();
        }
        catch (err) {
            console.log(err);
            return response.status(400).json({ error: 'Unexpected error while creating new user.' });
        }
    }
}
exports.default = UserController;
