"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
const crypto_1 = __importDefault(require("crypto"));
// create a folder named "uploads" inside the "temp" folder;
exports.default = {
    storage: multer_1.default.diskStorage({
        destination: path_1.resolve(__dirname, '..', '..', 'temp', 'uploads'),
        filename(request, file, callback) {
            const hash = crypto_1.default.randomBytes(6).toString('hex');
            const filename = `${hash}-${file.originalname}`;
            callback(null, filename);
        }
    }),
    limits: {
        fileSize: 4 * 1024 * 1024,
    },
    fileFilter: ((request, file, callback) => {
        const allowedMines = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ];
        if (allowedMines.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error('Invalid file type'));
        }
    })
};
