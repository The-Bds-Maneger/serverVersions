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
export type Root = {
  latest: {
    bedrock: string,
    java: string,
    pocketmine: string,
    spigot: string
  },
  versions: {
    bedrock: bedrock[],
    java: java[],
    pocketmine: pocketmine[],
    spigot: spigot[]
  }
};

/*
TODO:
  Vou ter que reescrever todo o cliente para selecionar o backup ou mainstream, agora vou procurar migrar alguns aplicação para funções seveless
*/

export const versionAPIs = [
  "https://mcpeversions.sirherobrine23.org",
  "https://mcpeversions_backup.sirherobrine23.org",
  "http://168.138.140.152"
];
export let versionUrl = versionAPIs[0];
setInterval(async () => {
  httpRequests.RAW_TEXT(versionAPIs[0]).then(() => versionAPIs[0]).catch(() => httpRequests.RAW_TEXT(versionAPIs[1]).then(() => versionAPIs[1])).catch(() => httpRequests.RAW_TEXT(versionAPIs[2]).then(() => versionAPIs[2])).then(ip => versionUrl).catch(err => {
    console.warn("Cannot get Avaible API");
  });
}, 1000);

export async function findVersion(bdsPlaform: BdsCorePlatforms, version: string|boolean) {
  
}