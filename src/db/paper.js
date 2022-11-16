"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paper = exports.app = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connect_1 = __importDefault(require("./connect"));
const express_1 = require("express");
exports.app = (0, express_1.Router)();
exports.paper = connect_1.default.model("paper", new mongoose_1.default.Schema({
    version: String,
    build: Number,
    date: Date,
    latest: Boolean,
    url: String
}));
exports.app.get("/", ({ res }) => exports.paper.find().lean().then(data => res.json(data)));
exports.app.get("/latest", ({ res }) => exports.paper.findOne({ latest: true }).lean().then(data => res.json(data)));
exports.app.get("/search", async (req, res) => {
    let version = req.query.version;
    if (!version)
        return res.status(400).json({ erro: "Not allowd blank version" });
    let build = parseInt(req.query.build);
    if (isNaN(build))
        build = undefined;
    if (!!build) {
        const info = await exports.paper.findOne({
            version,
            build
        });
        if (!info)
            return res.status(400).json({ error: "version and build not exists" });
        return res.json(info);
    }
    const info = await exports.paper.findOne({
        version
    });
    if (!info)
        return res.status(400).json({ error: "version not exists" });
    return res.json(info);
});
