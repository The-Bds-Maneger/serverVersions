"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.java = exports.app = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connect_1 = __importDefault(require("./connect"));
const express_1 = require("express");
exports.app = (0, express_1.Router)();
exports.java = connect_1.default.model("java", new mongoose_1.default.Schema({
    version: {
        type: String,
        required: true,
        unique: true
    },
    date: Date,
    latest: Boolean,
    url: String
}));
exports.default = exports.java;
exports.app.get("/", ({ res }) => exports.java.find().lean().then(data => res.json(data)));
exports.app.get("/latest", async ({ res }) => res.json(await exports.java.findOne({ latest: true }).lean()));
exports.app.get("/search", async (req, res) => {
    let version = req.query.version;
    if (!version)
        return res.status(400).json({ error: "No version specified" });
    const versionFinded = await exports.java.findOne({ version: version }).lean();
    if (!versionFinded)
        return res.status(404).json({ error: "Version not found" });
    return res.json(versionFinded);
});
