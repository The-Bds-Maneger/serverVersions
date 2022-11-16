"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.mongoURL = exports.authPassword = exports.authUsername = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.authUsername = (!!process.env.MONGO_USER) ? process.env.MONGO_USER : "public";
exports.authPassword = (!!process.env.MONGO_PASSWORD) ? process.env.MONGO_PASSWORD : "n0v8IBKEI920sfy8";
exports.mongoURL = process.env.BDSVERSIONDB || `mongodb+srv://${exports.authUsername}:${exports.authPassword}@versionstorage.qgh8v.mongodb.net/v2_versions`;
// Connect to MongoDB
exports.connection = mongoose_1.default.createConnection(exports.mongoURL);
exports.default = exports.connection;
