"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pocketmine = exports.app = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connect_1 = __importDefault(require("./connect"));
const express_1 = require("express");
const core_utils_1 = require("@the-bds-maneger/core-utils");
exports.app = (0, express_1.Router)();
exports.pocketmine = connect_1.default.model("pocketminemmp", new mongoose_1.default.Schema({
    version: {
        type: String,
        required: true,
        unique: true
    },
    date: Date,
    latest: Boolean,
    url: String
}));
exports.app.get("/", ({ res }) => exports.pocketmine.find().lean().then(data => res.json(data)));
exports.app.get("/latest", async ({ res }) => res.json(await exports.pocketmine.findOne({ latest: true }).lean()));
exports.app.get("/bin", async (req, res) => {
    let os = RegExp(req.query.os || "(win32|windows|linux|macos|mac)");
    let arch = RegExp(req.query.arch || ".*");
    const redirect = req.query.redirect === "true";
    const rele = await core_utils_1.httpRequestGithub.GithubRelease("The-Bds-Maneger/Build-PHP-Bins");
    const Files = [];
    for (const release of rele) {
        for (const asset of release.assets) {
            if (os.test(asset.name) && arch.test(asset.name))
                Files.push({
                    url: asset.browser_download_url,
                    name: asset.name
                });
        }
    }
    if (Files.length >= 1) {
        if (redirect)
            return res.redirect(Files[0].url);
        return res.json(Files);
    }
    return res.status(404).json({ error: "No bin found" });
});
exports.app.get("/search", async (req, res) => {
    let version = req.query.version;
    if (!version)
        return res.status(400).json({ error: "No version specified" });
    const versionFinded = await exports.pocketmine.findOne({ version }).lean();
    if (!versionFinded)
        return res.status(404).json({ error: "Version not found" });
    return res.json(versionFinded);
});
