import fsOld from "node:fs";
import path from "node:path";
import fs from "node:fs/promises";
const rootVersions = path.join(process.cwd(), "versions");
const Bedrock = path.join(rootVersions, "bedrock");
const Pocketmine = path.join(rootVersions, "pocketmine");
const Powernukkit = path.join(rootVersions, "powernukkit");
const Java = path.join(rootVersions, "java");
const Spigot = path.join(rootVersions, "spigot");
const Paper = path.join(rootVersions, "paper");
if (!fsOld.existsSync(rootVersions)) await fs.mkdir(rootVersions, {recursive: true});
if (!fsOld.existsSync(Bedrock)) await fs.mkdir(Bedrock, {recursive: true});
if (!fsOld.existsSync(Pocketmine)) await fs.mkdir(Pocketmine, {recursive: true});
if (!fsOld.existsSync(Powernukkit)) await fs.mkdir(Powernukkit, {recursive: true});
if (!fsOld.existsSync(Java)) await fs.mkdir(Java, {recursive: true});
if (!fsOld.existsSync(Spigot)) await fs.mkdir(Spigot, {recursive: true});
if (!fsOld.existsSync(Paper)) await fs.mkdir(Paper, {recursive: true});

const versionURLs = ["https://mcpeversions.sirherobrine23.org", "https://mcpeversions_backup.sirherobrine23.org"];
export async function getVersions(bdsPlaform, version) {
  for (let url of versionURLs) {
    url += "/"+bdsPlaform;
    if (typeof version !== "undefined") {
      if (typeof version === "boolean"||version === "latest") url += "/latest";
      else url += `/search?version=${version}`;
    }
    const res = await (await fetch("https://mcpeversions.sirherobrine23.org/bedrock")).json().catch(() => false);
    if (res === false) continue;
    const data = JSON.parse(res.toString("utf8"), (key, value) => key === "date" ? new Date(value):value);
    if (!data) throw new Error("Failed to get data");
    return data;
  }
  throw new Error("Failed to exec API request!");
}

const bedrockData = await getVersions("bedrock");
fs.writeFile(path.join(Bedrock, "latest.json"), JSON.stringify(bedrockData.find(release => release.latest), null, 2));
fs.writeFile(path.join(Bedrock, "all.json"), JSON.stringify(bedrockData, null, 2));
await Promise.all(bedrockData.map(releases => {
  const version = path.join(Bedrock, `${releases.version}.json`);
  return fs.writeFile(version, JSON.stringify(releases, null, 2));
}));

const PocketmineData = await getVersions("pocketmine");
fs.writeFile(path.join(Pocketmine, "latest.json"), JSON.stringify(PocketmineData.find(release => release.latest), null, 2));
fs.writeFile(path.join(Pocketmine, "all.json"), JSON.stringify(PocketmineData, null, 2));
await Promise.all(PocketmineData.map(releases => {
  const version = path.join(Pocketmine, `${releases.version}.json`);
  return fs.writeFile(version, JSON.stringify(releases, null, 2));
}));

const PowernukkitData = await getVersions("powernukkit");
fs.writeFile(path.join(Powernukkit, "latest.json"), JSON.stringify(PowernukkitData.find(release => release.latest), null, 2));
fs.writeFile(path.join(Powernukkit, "all.json"), JSON.stringify(PowernukkitData, null, 2));
await Promise.all(PowernukkitData.map(releases => {
  const version = path.join(Powernukkit, `${releases.version}.json`);
  return fs.writeFile(version, JSON.stringify(releases, null, 2));
}));

const JavaData = await getVersions("java");
fs.writeFile(path.join(Java, "latest.json"), JSON.stringify(JavaData.find(release => release.latest), null, 2));
fs.writeFile(path.join(Java, "all.json"), JSON.stringify(JavaData, null, 2));
await Promise.all(JavaData.map(releases => {
  const version = path.join(Java, `${releases.version}.json`);
  return fs.writeFile(version, JSON.stringify(releases, null, 2));
}));

const SpigotData = await getVersions("spigot");
fs.writeFile(path.join(Spigot, "latest.json"), JSON.stringify(SpigotData.find(release => release.latest), null, 2));
fs.writeFile(path.join(Spigot, "all.json"), JSON.stringify(SpigotData, null, 2));
await Promise.all(SpigotData.map(releases => {
  const version = path.join(Spigot, `${releases.version}.json`);
  return fs.writeFile(version, JSON.stringify(releases, null, 2));
}));

const PaperData = await getVersions("paper");
fs.writeFile(path.join(Paper, "latest.json"), JSON.stringify(PaperData.find(release => release.latest), null, 2));
fs.writeFile(path.join(Paper, "all.json"), JSON.stringify(PaperData, null, 2));
await Promise.all(PaperData.map(releases => {
  const version = path.join(Paper, `${releases.version}_${releases.build}.json`);
  return fs.writeFile(version, JSON.stringify(releases, null, 2));
}));