"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_utils_1 = require("@the-bds-maneger/core-utils");
const java_1 = require("../db/java");
async function Add(Version, versionDate, url) {
    if (await java_1.java.findOne({ version: Version }).lean().then(data => !!data).catch(() => true))
        return;
    await java_1.java.create({
        version: Version,
        date: versionDate,
        latest: false,
        url: url
    });
}
async function Find() {
    var _a, _b, _c, _d;
    const Versions = await core_utils_1.httpRequest.getJSON("https://launchermeta.mojang.com/mc/game/version_manifest_v2.json");
    for (const ver of Versions.versions.filter(a => a.type === "release")) {
        const Release = await core_utils_1.httpRequest.getJSON(ver.url);
        if (!!((_b = (_a = Release === null || Release === void 0 ? void 0 : Release.downloads) === null || _a === void 0 ? void 0 : _a.server) === null || _b === void 0 ? void 0 : _b.url))
            await Add(ver.id, new Date(ver.releaseTime), (_d = (_c = Release === null || Release === void 0 ? void 0 : Release.downloads) === null || _c === void 0 ? void 0 : _c.server) === null || _d === void 0 ? void 0 : _d.url);
    }
    return await java_1.java.findOneAndUpdate({ version: Versions.latest.release }, { $set: { latest: true } }).lean();
}
async function UpdateDatabase() {
    const latestVersion = await java_1.java.findOneAndUpdate({ latest: true }, { $set: { latest: false } }).lean();
    return {
        new: await Find(),
        old: latestVersion
    };
}
exports.default = UpdateDatabase;
