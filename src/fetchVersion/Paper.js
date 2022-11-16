"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_utils_1 = require("@the-bds-maneger/core-utils");
const paper_1 = require("../db/paper");
async function find() {
    const versions = (await core_utils_1.httpRequest.getJSON("https://api.papermc.io/v2/projects/paper")).versions;
    for (const version of versions) {
        const builds = await core_utils_1.httpRequest.getJSON(`https://api.papermc.io/v2/projects/paper/versions/${version}/builds`);
        await Promise.all(builds.builds.map(async function (build) {
            const downloadUrl = `https://api.papermc.io/v2/projects/paper/versions/${builds.version}/builds/${build.build}/downloads/${build.downloads.application.name}`;
            if (await paper_1.paper.findOne({ url: downloadUrl }).lean())
                return;
            await paper_1.paper.create({
                version: builds.version,
                build: build.build,
                date: new Date(build.time),
                url: downloadUrl,
                latest: false
            });
            return;
        }));
    }
    await paper_1.paper.findOneAndUpdate({ latest: true }, { $set: { latest: false } }).lean();
    const latestVersionByDate = (await paper_1.paper.find().lean()).sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    await paper_1.paper.findByIdAndUpdate(latestVersionByDate._id, { $set: { latest: true } }).lean();
}
exports.default = find;
