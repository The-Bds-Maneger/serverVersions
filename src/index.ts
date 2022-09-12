import * as httpRequests from "./lib/HTTP_Request";
import type { bedrockSchema } from "./db/bedrock";
import type { javaSchema } from "./db/java";
import type { paperSchema } from "./db/paper";
import type { powernukkitSchema } from "./db/powernukkit";
import type { pocketminemmpSchema } from "./db/pocketmine";
import type { spigotSchema } from "./db/spigot";
export type arch = "x64"|"arm64"|"arm"|"ia32"|"mips"|"mipsel"|"ppc"|"ppc64"|"s390"|"s390x"|"x32";
export type osPlatform = "darwin"|"win32"|"linux"|"android";
export type BdsCorePlatforms = "bedrock"|"java"|"paper"|"powernukkit"|"pocketmine"|"spigot";

export const versionURLs = ["https://mcpeversions.sirherobrine23.org", "https://mcpeversions_backup.sirherobrine23.org", "http://168.138.140.152"];
export {
  bedrockSchema as bedrock,
  javaSchema as java,
  paperSchema as paper,
  pocketminemmpSchema as pocketmine,
  spigotSchema as spigot,
  powernukkitSchema as powernukkit
}
export type all = bedrockSchema|javaSchema|powernukkitSchema|paperSchema|pocketminemmpSchema|spigotSchema

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
    const data = JSON.parse(res.toString("utf8"), (key, value) => key === "date" ? new Date(value):value);
    if (!data) throw new Error("Failed to get data");
    return data;
  }
  throw new Error("Failed to exec API request!");
}

export const findBedrock = (version: string|boolean) => findVersion("bedrock", version).then((res: bedrockSchema) => res);
export const getBedrockZip = (version: string|boolean, options: {platform?: string}) => findBedrock(version).then(res => {
  const plaftorm = options?.platform||process.platform;
  if (res.url[plaftorm] === undefined) throw new Error("Platform not avaible");
  return httpRequests.fetchBuffer(res.url[plaftorm]);
});

export const findPocketmine = (version: string|boolean) => findVersion("pocketmine", version).then((res: pocketminemmpSchema) => res);
export const getPocketminePhar = (version: string|boolean) => findPocketmine(version).then(res => httpRequests.fetchBuffer(res.url));

export const findJava = (version: string|boolean) => findVersion("java", version).then((res: javaSchema) => res);
export const findSpigot = (version: string|boolean) => findVersion("spigot", version).then((res: spigotSchema) => res);
export const getJavaJar = (version: string|boolean) => findJava(version).then(res => httpRequests.fetchBuffer(res.url));
export const getSpigotJar = (version: string|boolean) => findSpigot(version).then(res => httpRequests.fetchBuffer(res.url));
