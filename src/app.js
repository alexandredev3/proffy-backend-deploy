"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv");
const bull_board_1 = __importDefault(require("bull-board"));
const path_1 = require("path");
const Queue_1 = __importDefault(require("./lib/Queue"));
const routes_1 = require("./routes");
class AppController {
    constructor() {
        this.server = express_1.default();
        this.server = express_1.default();
        bull_board_1.default.setQueues(Queue_1.default.queues.map(queue => queue.bull));
        this.middlwares();
        this.routes();
    }
    middlwares() {
        this.server.use(cors_1.default());
        this.server.use(express_1.default.json());
        this.server.use('/files', express_1.default.static(path_1.resolve(__dirname, '..', 'temp', 'uploads')));
        this.server.use('/admin/queues', bull_board_1.default.UI);
    }
    routes() {
        this.server.use(routes_1.routes);
    }
}
exports.default = new AppController().server;
