"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_utils_1 = require("@the-bds-maneger/core-utils");
const pocketmine_1 = require("../db/pocketmine");
async function Add(Version, versionDate, url) {
    if (await pocketmine_1.pocketmine.findOne({ version: Version }).lean().then(data => !!data).catch(() => true))
        return;
    await pocketmine_1.pocketmine.create({
        version: Version,
        date: versionDate,
        latest: false,
        url: url
    });
}
async function Find() {
    return await Promise.all((await core_utils_1.httpRequestGithub.GithubRelease("pmmp/PocketMine-MP")).filter(Release => !/beta|alpha/gi.test(Release.tag_name.toLowerCase())).map(Release => {
        Release.assets = Release.assets.filter(asset => asset.name.endsWith(".phar"));
        return Release;
    }).filter(a => a.assets.length > 0).map(release => {
        return Add(release.tag_name, new Date(release.published_at), release.assets[0].browser_download_url).catch(err => {
            console.log("Pocketmine PMMP: Version %s, Error: %o", release.tag_name, err);
        }).then(() => ({
            Date: new Date(release.published_at),
            Version: release.tag_name,
            url: release.assets[0].browser_download_url
        }));
    }));
}
async function UpdateDatabase() {
    const latestVersion = await pocketmine_1.pocketmine.findOneAndUpdate({ latest: true }, { $set: { latest: false } }).lean();
    const Releases = await Find();
    const newLatest = await pocketmine_1.pocketmine.findOneAndUpdate({ version: Releases[0].Version }, { $set: { latest: true } }).lean();
    return {
        new: newLatest,
        old: latestVersion
    };
}
exports.default = UpdateDatabase;
