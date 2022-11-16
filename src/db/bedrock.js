"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.app = void 0;
const core_utils_1 = require("@the-bds-maneger/core-utils");
const express_1 = require("express");
exports.app = (0, express_1.Router)();
async function getAll() {
    return core_utils_1.httpRequest.getJSON("https://the-bds-maneger.github.io/BedrockFetch/all.json");
}
exports.getAll = getAll;
exports.app.get("/", ({ res }) => getAll().then(data => res.json(data)));
exports.app.get("/latest", async ({ res }) => res.json((await getAll()).at(-1)));
exports.app.get("/search", async (req, res) => {
    let version = req.query.version;
    if (!version)
        return res.status(400).json({ error: "No version specified" });
    const versionFinded = (await getAll()).find(rel => rel.version === version);
    if (!versionFinded)
        return res.status(404).json({ error: "Version not found" });
    return res.json(versionFinded);
});
