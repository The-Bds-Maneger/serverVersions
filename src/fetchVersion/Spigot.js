"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRegex = void 0;
const jsdom_1 = __importDefault(require("jsdom"));
const core_utils_1 = require("@the-bds-maneger/core-utils");
const spigot_1 = require("../db/spigot");
exports.urlRegex = /http[s]:\/\/.*/;
async function Find() {
    const { document } = (new jsdom_1.default.JSDOM(await core_utils_1.httpRequest.bufferFetch("https://getbukkit.org/download/spigot").then(res => res.data.toString("utf8")).catch(err => { console.log(err); return "<html></html>"; }))).window;
    const dooms = document.querySelectorAll("#download > div > div > div > div");
    const Versions = await Promise.all(([...dooms]).map(async (DOM) => {
        const download = (new jsdom_1.default.JSDOM(await core_utils_1.httpRequest.bufferFetch(DOM.querySelector("div > div.col-sm-4 > div.btn-group > a")["href"]).then(res => res.data.toString("utf8"))));
        const serverInfo = {
            version: String(DOM.querySelector("div:nth-child(1) > h2").textContent),
            Date: new Date(DOM.querySelector("div:nth-child(3) > h3").textContent),
            url: download.window.document.querySelector("#get-download > div > div > div:nth-child(2) > div > h2 > a")["href"]
        };
        if (!exports.urlRegex.test(serverInfo.url) || !serverInfo.url)
            return null;
        return serverInfo;
    }));
    for (const Version of Versions.filter(a => a)) {
        if (await spigot_1.spigot.findOne({ version: Version.version }).lean())
            continue;
        console.log("Spigot", Version.version, Version.url);
        await spigot_1.spigot.create({
            version: Version.version,
            date: Version.Date,
            latest: false,
            url: Version.url
        });
    }
    await spigot_1.spigot.findOneAndUpdate({ latest: true }, { $set: { latest: false } }).lean();
    const latestVersion = (await spigot_1.spigot.find().lean()).sort((b, a) => a.date.getTime() - b.date.getTime())[0];
    await spigot_1.spigot.findByIdAndUpdate(latestVersion._id, { $set: { latest: true } });
}
async function UpdateDatabase() {
    await Find();
}
exports.default = UpdateDatabase;
