"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
const auth_1 = __importDefault(require("../../config/auth"));
exports.default = async (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({
            error: 'Token not provided'
        });
    }
    const [, token] = authHeader.split(' ');
    try {
        const decoded = await util_1.promisify(jsonwebtoken_1.default.verify)(token, auth_1.default.secret);
        request.userId = decoded.id;
        return next();
    }
    catch (err) {
        return response.status(400).json({
            error: 'Token invalid'
        });
    }
};
