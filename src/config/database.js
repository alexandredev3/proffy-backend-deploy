"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
dotenv_1.default.config({
  path:
    process.env.NODE_ENV === "test"
      ? path_1.resolve(__dirname, "..", "..", ".env.test")
      : path_1.resolve(__dirname, "..", "..", ".env"),
});
exports.default = {
  development: {
    client: process.env.DB_CLIENT,
    connection: process.env.DATABASE_URL,
  },
  test: {
    client: process.env.DB_CLIENT_TEST,
    connection: process.env.DATABASE_URL,
  },
};
