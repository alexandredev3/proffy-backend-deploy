"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("dotenv/config");
const knex_1 = __importDefault(require("knex"));
const database_1 = __importDefault(require("../config/database"));
const config = process.env.NODE_ENV === 'test'
    ? database_1.default.test
    : database_1.default.development;
const db = knex_1.default(config);
exports.db = db;
