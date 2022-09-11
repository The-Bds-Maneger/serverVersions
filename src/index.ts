import * as httpRequests from "./lib/HTTP_Request";
export type arch = "x64"|"arm64"|"arm"|"ia32"|"mips"|"mipsel"|"ppc"|"ppc64"|"s390"|"s390x"|"x32";
export type osPlatform = "darwin"|"win32"|"linux"|"android";
export type BdsCorePlatforms = "bedrock"|"java"|"pocketmine"|"spigot";
import type { bedrockSchema } from "./db/bedrock";
import type { javaSchema } from "./db/java";
import type { nukkitSchema } from "./db/nukkit";
import type { paperSchema } from "./db/paper";
import type { pocketminemmpSchema } from "./db/pocketmine";
import type { spigotSchema } from "./db/spigot";

export const versionURLs = ["https://mcpeversions.sirherobrine23.org", "https://mcpeversions_backup.sirherobrine23.org", "http://168.138.140.152"];
export {
  bedrockSchema as bedrock,
  javaSchema as java,
  nukkitSchema as nukkit,
  paperSchema as paper,
  pocketminemmpSchema as pocketmine,
  spigotSchema as spigot
}

export type all = bedrockSchema|javaSchema|nukkitSchema|paperSchema|pocketminemmpSchema|spigotSchema

export async function findVersion(bdsPlaform: BdsCorePlatforms): Promise<all[]>;
export async function findVersion(bdsPlaform: BdsCorePlatforms, version: string|boolean): Promise<all>;
export async function findVersion(bdsPlaform: BdsCorePlatforms, version?: string|boolean): Promise<all|all[]> {
  for (let url of versionURLs) {
    url += "/"+bdsPlaform;
    if (typeof version !== "undefined") {
      if (typeof version === "boolean"||version === "latest") url += "/latest";
      else url += `/search?version=${version}`;
    }
    const res = await httpRequests.fetchBuffer(url).catch(() => false);
    if (res === false) continue;
    return JSON.parse(res.toString("utf8"), (key, value) => key === "datePublish" ? new Date(value):value);
  }
  throw new Error("Failed to exec API request!");
}

export const findBedrock = (version: string|boolean) => findVersion("bedrock", version).then((res: bedrockSchema) => res);
export const getBedrockZip = (version: string|boolean, arch?: string, platform?: string) => findBedrock(version).then(res => (res[platform||process.platform]||{})[arch||process.arch]).then((res: string|void) => {
  if (!res) throw new Error("No file located");
  return httpRequests.fetchBuffer(res);
});
export const findPocketmine = (version: string|boolean) => findVersion("pocketmine", version).then((res: pocketminemmpSchema) => res);
export const getPocketminePhar = (version: string|boolean) => findPocketmine(version).then(res => httpRequests.fetchBuffer(res.url));

export const findJava = (version: string|boolean) => findVersion("java", version).then((res: javaSchema) => res);
export const findSpigot = (version: string|boolean) => findVersion("spigot", version).then((res: spigotSchema) => res);
export const getJavaJar = (version: string|boolean) => findJava(version).then(res => httpRequests.fetchBuffer(res.url));
export const getSpigotJar = (version: string|boolean) => findSpigot(version).then(res => httpRequests.fetchBuffer(res.url));
