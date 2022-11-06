import path from "node:path";
import fs from "node:fs/promises";

async function exists(filePath: string) {return fs.access(filePath).then(() => true).catch(() => false);}
const versionRoot = path.join(__dirname, "..", "versions");

export type bdsCorePlatforms = "bedrock" | "java" | "pocketmine" | "spigot" | "paper" | "powernukkit";
export const platforms: bdsCorePlatforms[] = ["bedrock", "java", "paper", "pocketmine", "powernukkit", "spigot"];
export type localRegisterSchema<bdsPlatform extends bdsCorePlatforms, dateType extends Date|string> = {
  bdsPlatform: bdsPlatform,
  version: string,
  date: dateType,
  url: bdsPlatform extends "bedrock" ? {[platform in NodeJS.Platform]?: {[arch in NodeJS.Architecture]?: string}} : string;
};

export async function registerNew<platform extends bdsCorePlatforms>(data: localRegisterSchema<platform, Date>) {
  const fileSave = path.join(versionRoot, data.bdsPlatform, `${data.version}.json`);
  if (!await exists(path.dirname(fileSave))) await fs.mkdir(path.dirname(fileSave), {recursive: true});
  await fs.writeFile(fileSave, JSON.stringify(data, null, 2));
}

export type getObject = {platform: bdsCorePlatforms, data: {[version: string]: localRegisterSchema<bdsCorePlatforms, Date>}};
export type getObject2 = {[target in bdsCorePlatforms]: {[version: string]: localRegisterSchema<bdsCorePlatforms, Date>}};
export async function get(): Promise<getObject2>;
export async function get(platform: bdsCorePlatforms): Promise<getObject>;
export async function get(platform?: bdsCorePlatforms): Promise<getObject|getObject2> {
  if (!await exists(versionRoot)) await fs.mkdir(versionRoot, {recursive: true});
  if (platform) {
    const data = (await Promise.all((await fs.readdir(path.join(versionRoot, platform))).map(async version => {
      const data: localRegisterSchema<typeof platform, string> = JSON.parse(await fs.readFile(path.join(versionRoot, platform, version), "utf8"));
      return {...data, date: new Date(data.date)} as localRegisterSchema<typeof platform, Date>;
    }))).sort((b, a) => a.date.getTime() - b.date.getTime()).reduce((mount, data) => {
      mount[data.version] = data;
      return mount;
    }, {});
    return {platform, data}
  }
  return (await fs.readdir(versionRoot).then((folders: bdsCorePlatforms[]) => Promise.all(folders.map(async folder => get(folder))))).reduce((mount, data) => {mount[data.platform] = data.data; return mount;}, {} as getObject2);
}