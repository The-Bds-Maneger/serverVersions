"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformManeger = exports.findVersion = void 0;
const core_utils_1 = require("@the-bds-maneger/core-utils");
async function findVersion(bdsPlaform, version, ignoreStatic) {
    const versionURLs = ["https://mcpeversions_backup.sirherobrine23.org", "https://mcpeversions.sirherobrine23.org"];
    if (!ignoreStatic)
        versionURLs.push("https://mcpeversion-static.sirherobrine23.org/");
    else
        console.warn("Using dynamic APIs, some may be down!");
    for (let url of versionURLs.reverse()) {
        url += "/" + bdsPlaform;
        if (/static/.test(url)) {
            if (version === undefined)
                url += "/all.json";
            else if (typeof version === "boolean")
                url += "/latest.json";
            else
                url += `/${version}.json`;
        }
        else {
            if (version === undefined || version === "all")
                url += "/";
            else {
                if (typeof version === "boolean" || version === "latest")
                    url += "/latest";
                else
                    url += `/search?version=${version}`;
            }
        }
        const res = await core_utils_1.httpRequest.bufferFetch(url).then(({ data }) => data).catch(() => false);
        if (res === false)
            continue;
        const data = JSON.parse(res.toString("utf8"), (key, value) => key === "date" ? new Date(value) : value);
        if (!data)
            throw new Error("Failed to get data");
        return data;
    }
    throw new Error("Failed to exec API request!");
}
exports.findVersion = findVersion;
exports.platformManeger = {
    bedrock: {
        async all() { return core_utils_1.httpRequest.getJSON("https://the-bds-maneger.github.io/BedrockFetch/all.json"); },
        async find(version) {
            const all = await core_utils_1.httpRequest.getJSON("https://the-bds-maneger.github.io/BedrockFetch/all.json");
            if (typeof version === "boolean" || version.toLowerCase().trim() === "latest")
                return all.at(-1);
            const rel = all.find(rel => rel.version === version);
            if (!rel)
                throw new Error("Version not found");
            return rel;
        }
    },
    pocketmine: {
        async all() { return findVersion("pocketmine"); },
        async find(version) { return findVersion("pocketmine", version); }
    },
    powernukkit: {
        async all() { return findVersion("powernukkit"); },
        async find(version) { return findVersion("powernukkit", version); }
    },
    java: {
        async all() { return findVersion("java"); },
        async find(version) { return findVersion("java", version); }
    },
    spigot: {
        async all() { return findVersion("spigot"); },
        async find(version) { return findVersion("spigot", version); }
    },
    paper: {
        async all() { return findVersion("paper"); },
        async find(version, build) {
            var _a;
            if (!build)
                build = (_a = (await findVersion("paper")).find(ver => ver.version === version)) === null || _a === void 0 ? void 0 : _a.build;
            return findVersion("paper", `${version}${!!build ? "_" + build : ""}`);
        }
    }
};
