"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.powernukkit = exports.app = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connect_1 = __importDefault(require("./connect"));
const express_1 = require("express");
exports.app = (0, express_1.Router)();
exports.powernukkit = connect_1.default.model("powernukkit", new mongoose_1.default.Schema({
    version: {
        type: String,
        unique: false,
        required: true
    },
    mcpeVersion: String,
    date: Date,
    url: String,
    variantType: String,
    latest: Boolean
}));
exports.app.get("/", ({ res }) => exports.powernukkit.find().lean().then(data => res.json(data)));
exports.app.get("/latest", ({ res }) => exports.powernukkit.findOne({ latest: true }).lean().then(data => res.json(data)));
exports.app.get("/search", async (req, res) => {
    let version = req.query.version;
    let variant = req.query.variant || undefined;
    if (!version)
        return res.status(400).json({ error: "No version specified" });
    const versionDB = await exports.powernukkit.findOne({ version, variant: { to: variant } }).lean();
    if (!versionDB)
        return res.status(404).json({ error: "Version not found" });
    return res.json(versionDB);
});
