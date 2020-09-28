"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordCompare = exports.encryptsPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const connection_1 = require("../database/connection");
function encryptsPassword(password) {
    const field_hash = bcryptjs_1.default.hash(password, 8);
    return field_hash;
}
exports.encryptsPassword = encryptsPassword;
async function passwordCompare(password, email) {
    const user = await connection_1.db('users')
        .where('email', '=', email)
        .first();
    const password_compare = bcryptjs_1.default.compare(password, user.password_hash);
    return password_compare;
}
exports.passwordCompare = passwordCompare;
