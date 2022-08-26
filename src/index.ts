import * as httpRequests from "./fetchVersion/HTTP_Request";
export type arch = "x64"|"arm64"|"arm"|"ia32"|"mips"|"mipsel"|"ppc"|"ppc64"|"s390"|"s390x"|"x32";
export type osPlatform = "darwin"|"win32"|"linux"|"android";
export type BdsCorePlatforms = "bedrock"|"java"|"pocketmine"|"spigot";

export type base = {
  version: string,
  datePublish: string,
};
export type bedrock = base & {
  win32: {
    x64: string,
    arm64?: string,
  },
  linux: {
    x64: string,
    arm64?: string,
  },
  darwin?: {
    x64?: string,
    arm64?: string,
  }
};
export type java = base & {
  javaJar: string
};
export type pocketmine = base & {
  pocketminePhar: string
};
export type spigot = base & {
  spigotJar: string
};
export type home = {
  [platform: string]: {
    version: string,
    search: string
  }
};

export const versionAPIs = ["https://mcpeversions.sirherobrine23.org", "https://mcpeversions_backup.sirherobrine23.org", "http://168.138.140.152"];
export let versionUrl = versionAPIs[0];
setInterval(async () => httpRequests.RAW_TEXT(versionAPIs[0]).then(() => versionAPIs[0]).catch(() => httpRequests.RAW_TEXT(versionAPIs[1]).then(() => versionAPIs[1])).catch(() => httpRequests.RAW_TEXT(versionAPIs[2]).then(() => versionAPIs[2])).then(ip => versionUrl).catch(() => console.warn("Cannot get Avaible API")), 1000*60*60*5);

export async function findVersion(bdsPlaform: BdsCorePlatforms, version?: string|boolean): Promise<bedrock|bedrock[]|java|java[]|pocketmine|pocketmine[]|spigot|spigot[]> {
  return httpRequests.getJson(`${versionUrl}/${bdsPlaform}/${typeof version === "undefined"?"":typeof version === "boolean"?"latest":"search?version="+version}`)
}

export const findBedrock = (version: string|boolean) => findVersion("bedrock", version).then((res: bedrock) => res);
export const getBedrockZip = (version: string|boolean, arch?: string, platform?: string) => findBedrock(version).then(res => (res[platform||process.platform]||{})[arch||process.arch]).then((res: string|void) => {
  if (!res) throw new Error("No file located");
  return httpRequests.fetchBuffer(res);
});
export const findPocketmine = (version: string|boolean) => findVersion("pocketmine", version).then((res: pocketmine) => res);
export const getPocketminePhar = (version: string|boolean) => findPocketmine(version).then(res => httpRequests.fetchBuffer(res.pocketminePhar));

export const findJava = (version: string|boolean) => findVersion("java", version).then((res: java) => res);
export const findSpigot = (version: string|boolean) => findVersion("spigot", version).then((res: spigot) => res);
export const getJavaJar = (version: string|boolean) => findJava(version).then(res => httpRequests.fetchBuffer(res.javaJar));
export const getSpigotJar = (version: string|boolean) => findSpigot(version).then(res => httpRequests.fetchBuffer(res.spigotJar));