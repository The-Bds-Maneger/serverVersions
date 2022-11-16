"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("node:fs/promises"));
const index_1 = require("./index");
const rootVersions = node_path_1.default.join(process.cwd(), "versions");
const Bedrock = node_path_1.default.join(rootVersions, "bedrock");
const Pocketmine = node_path_1.default.join(rootVersions, "pocketmine");
const Powernukkit = node_path_1.default.join(rootVersions, "powernukkit");
const Java = node_path_1.default.join(rootVersions, "java");
const Spigot = node_path_1.default.join(rootVersions, "spigot");
const Paper = node_path_1.default.join(rootVersions, "paper");
(async function () {
    if (!node_fs_1.default.existsSync(rootVersions))
        await promises_1.default.mkdir(rootVersions, { recursive: true });
    if (!node_fs_1.default.existsSync(Bedrock))
        await promises_1.default.mkdir(Bedrock, { recursive: true });
    if (!node_fs_1.default.existsSync(Pocketmine))
        await promises_1.default.mkdir(Pocketmine, { recursive: true });
    if (!node_fs_1.default.existsSync(Powernukkit))
        await promises_1.default.mkdir(Powernukkit, { recursive: true });
    if (!node_fs_1.default.existsSync(Java))
        await promises_1.default.mkdir(Java, { recursive: true });
    if (!node_fs_1.default.existsSync(Spigot))
        await promises_1.default.mkdir(Spigot, { recursive: true });
    if (!node_fs_1.default.existsSync(Paper))
        await promises_1.default.mkdir(Paper, { recursive: true });
    const bedrockData = await (0, index_1.findVersion)("bedrock", "all", true);
    promises_1.default.writeFile(node_path_1.default.join(Bedrock, "latest.json"), JSON.stringify(bedrockData.at(-1), null, 2));
    promises_1.default.writeFile(node_path_1.default.join(Bedrock, "all.json"), JSON.stringify(bedrockData, null, 2));
    await Promise.all(bedrockData.map(async (releases) => {
        const version = node_path_1.default.join(Bedrock, `${releases.version}.json`);
        await promises_1.default.writeFile(version, JSON.stringify(releases, null, 2));
        await promises_1.default.utimes(version, new Date(releases.date), new Date(releases.date));
    }));
    const PocketmineData = await (0, index_1.findVersion)("pocketmine", "all", true);
    promises_1.default.writeFile(node_path_1.default.join(Pocketmine, "latest.json"), JSON.stringify(PocketmineData.find(release => release.latest), null, 2));
    promises_1.default.writeFile(node_path_1.default.join(Pocketmine, "all.json"), JSON.stringify(PocketmineData, null, 2));
    await Promise.all(PocketmineData.map(async (releases) => {
        const version = node_path_1.default.join(Pocketmine, `${releases.version}.json`);
        await promises_1.default.writeFile(version, JSON.stringify(releases, null, 2));
        await promises_1.default.utimes(version, new Date(releases.date), new Date(releases.date));
    }));
    const PowernukkitData = await (0, index_1.findVersion)("powernukkit", "all", true);
    promises_1.default.writeFile(node_path_1.default.join(Powernukkit, "latest.json"), JSON.stringify(PowernukkitData.find(release => release.latest), null, 2));
    promises_1.default.writeFile(node_path_1.default.join(Powernukkit, "all.json"), JSON.stringify(PowernukkitData, null, 2));
    await Promise.all(PowernukkitData.map(async (releases) => {
        const version = node_path_1.default.join(Powernukkit, `${releases.version}.json`);
        await promises_1.default.writeFile(version, JSON.stringify(releases, null, 2));
        await promises_1.default.utimes(version, new Date(releases.date), new Date(releases.date));
    }));
    const JavaData = await (0, index_1.findVersion)("java", "all", true);
    promises_1.default.writeFile(node_path_1.default.join(Java, "latest.json"), JSON.stringify(JavaData.find(release => release.latest), null, 2));
    promises_1.default.writeFile(node_path_1.default.join(Java, "all.json"), JSON.stringify(JavaData, null, 2));
    await Promise.all(JavaData.map(async (releases) => {
        const version = node_path_1.default.join(Java, `${releases.version}.json`);
        await promises_1.default.writeFile(version, JSON.stringify(releases, null, 2));
        await promises_1.default.utimes(version, new Date(releases.date), new Date(releases.date));
    }));
    const SpigotData = await (0, index_1.findVersion)("spigot", "all", true);
    promises_1.default.writeFile(node_path_1.default.join(Spigot, "latest.json"), JSON.stringify(SpigotData.find(release => release.latest), null, 2));
    promises_1.default.writeFile(node_path_1.default.join(Spigot, "all.json"), JSON.stringify(SpigotData, null, 2));
    await Promise.all(SpigotData.map(async (releases) => {
        const version = node_path_1.default.join(Spigot, `${releases.version}.json`);
        await promises_1.default.writeFile(version, JSON.stringify(releases, null, 2));
        await promises_1.default.utimes(version, new Date(releases.date), new Date(releases.date));
    }));
    const PaperData = await (0, index_1.findVersion)("paper", "all", true);
    promises_1.default.writeFile(node_path_1.default.join(Paper, "latest.json"), JSON.stringify(PaperData.find(release => release.latest), null, 2));
    promises_1.default.writeFile(node_path_1.default.join(Paper, "all.json"), JSON.stringify(PaperData, null, 2));
    await Promise.all(PaperData.map(async (releases) => {
        const version = node_path_1.default.join(Paper, `${releases.version}_${releases.build}.json`);
        await promises_1.default.writeFile(version, JSON.stringify(releases, null, 2));
        await promises_1.default.utimes(version, new Date(releases.date), new Date(releases.date));
    }));
})();
