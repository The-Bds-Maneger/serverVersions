import * as httpRequests from "./lib/HTTP_Request";
import type { bedrockSchema } from "./db/bedrock";
import type { javaSchema } from "./db/java";
import type { paperSchema } from "./db/paper";
import type { powernukkitSchema } from "./db/powernukkit";
import type { pocketminemmpSchema } from "./db/pocketmine";
import type { spigotSchema } from "./db/spigot";
const versionURLs = ["https://mcpeversion-static.sirherobrine23.org/", "https://mcpeversions.sirherobrine23.org", "https://mcpeversions_backup.sirherobrine23.org"];

export type BdsCorePlatforms = "bedrock"|"java"|"paper"|"powernukkit"|"pocketmine"|"spigot";
export type all = bedrockSchema|javaSchema|powernukkitSchema|paperSchema|pocketminemmpSchema|spigotSchema
export type {
  bedrockSchema as bedrock,
  javaSchema as java,
  paperSchema as paper,
  pocketminemmpSchema as pocketmine,
  spigotSchema as spigot,
  powernukkitSchema as powernukkit
}

export async function findVersion<PlatformSchema = all[]>(bdsPlaform: BdsCorePlatforms): Promise<PlatformSchema>;
export async function findVersion<PlatformSchema = all>(bdsPlaform: BdsCorePlatforms, version: string|boolean): Promise<PlatformSchema>;
export async function findVersion<PlatformSchema = all|all[]>(bdsPlaform: BdsCorePlatforms, version?: string|boolean): Promise<PlatformSchema> {
  for (let url of versionURLs) {
    url += "/"+bdsPlaform;
    if (/static/.test(url)) {
      if (version === undefined) url += "/all.json";
      else if (typeof version === "boolean") url += "/latest.json";
      else url += `/${version}.json`;

    } else {
      if (typeof version !== "undefined") {
        if (typeof version === "boolean"||version === "latest") url += "/latest";
        else url += `/search?version=${version}`;
      }
    }
    const res = await httpRequests.fetchBuffer(url).catch(() => false);
    if (res === false) continue;
    const data = JSON.parse(res.toString("utf8"), (key, value) => key === "date" ? new Date(value):value);
    if (!data) throw new Error("Failed to get data");
    return data;
  }
  throw new Error("Failed to exec API request!");
}

export const platformManeger = {
  bedrock: {
    async all(){return findVersion<bedrockSchema[]>("bedrock");},
    async find(version: string|boolean){return findVersion<bedrockSchema>("bedrock", version);},
    async getBedrockZip(version: string|boolean, options: {platform?: NodeJS.Platform}) {
      return platformManeger.bedrock.find(version).then(res => {
        const plaftorm = options?.platform||process.platform;
        if (res.url[plaftorm] === undefined) throw new Error("Platform not avaible");
        return httpRequests.fetchBuffer(res.url[plaftorm]);
      });
    }
  },
  pocketmine: {
    async all(){return findVersion<pocketminemmpSchema[]>("pocketmine");},
    async find(version: string|boolean){return findVersion<pocketminemmpSchema>("pocketmine", version);},
    async getPhar(version: string|boolean){
      return platformManeger.pocketmine.find(version).then(res => httpRequests.fetchBuffer(res.url));
    },
    async getPhp(query?: {os?: string, arch?: string}){
      let os = RegExp(query?.os||"(win32|windows|linux|macos|mac)");
      let arch = RegExp(query?.arch||".*");
      const rele = await httpRequests.GithubRelease("The-Bds-Maneger/Build-PHP-Bins");
      for (const release of rele) {
        for (const asset of release.assets) {
          if (os.test(asset.name) && arch.test(asset.name)) return {buffer: await httpRequests.fetchBuffer(asset.browser_download_url), name: asset.name};
        }
      }
      throw new Error("No bin found");
    }
  },
  powernukkit: {
    async all(){return findVersion<powernukkitSchema[]>("powernukkit");},
    async find(version: string|boolean){return findVersion<powernukkitSchema>("powernukkit", version);},
    async getJar(version: string|boolean){return platformManeger.powernukkit.find(version).then(res => httpRequests.fetchBuffer(res.url))}
  },
  java: {
    async all(){return findVersion<javaSchema[]>("java");},
    async find(version: string|boolean){return findVersion<javaSchema>("java", version);},
    async getJar(version: string|boolean){return platformManeger.java.find(version).then(res => httpRequests.fetchBuffer(res.url))}
  },
  spigot: {
    async all(){return findVersion<spigotSchema[]>("spigot");},
    async find(version: string|boolean){return findVersion<spigotSchema>("spigot", version);},
    async getJar(version: string|boolean){return platformManeger.spigot.find(version).then(res => httpRequests.fetchBuffer(res.url))}
  },
  paper: {
    async all(){return findVersion<paperSchema[]>("paper");},
    async find(version: string|boolean){return findVersion<paperSchema>("paper", version);},
    async getJar(version: string|boolean){return platformManeger.paper.find(version).then(res => httpRequests.fetchBuffer(res.url))}
  }
};
