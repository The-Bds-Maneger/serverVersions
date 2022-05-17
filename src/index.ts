import { fetchBuffer } from "./fetchVersion/HTTP_Request";
import { Root } from "./types_request";
export type arch = "x64"|"arm64"|"arm"|"ia32"|"mips"|"mipsel"|"ppc"|"ppc64"|"s390"|"s390x"|"x32";
export type osPlatform = "darwin"|"win32"|"linux"|"android";
export type BdsCorePlatforms = "bedrock"|"java"|"pocketmine"|"spigot";

export default findUrlVersion;
/**
 * Search for a platform version of Bds Core, returning the file url and the publication date.
 * 
 * @param server - Bds Core Platform.
 * @param Version - Version of server, any type of boolean to get latest version or `latest` to get latest version.
 * @param Arch - Architecture of server.
 * @param Os - Operating system of server.
 * @returns Server Platform with url to download and date published.
 */
export async function findUrlVersion(server: BdsCorePlatforms, Version: string|boolean, Arch: string = process.arch, Os: string = process.platform): Promise<{version: string; url: string; datePublish: Date; raw?: Root["versions"]["bedrock"][0]|Root["versions"]["java"][0]|Root["versions"]["pocketmine"][0]|Root["versions"]["spigot"][0]}> {
  if (!Arch) Arch = process.arch;
  if (!Os) Os = process.platform;
  if (server === "bedrock") {
    let bedrockData: Root["versions"]["bedrock"][0] = undefined;
    if (Version === "latest"||typeof Version === "boolean") {
      bedrockData = JSON.parse(await fetchBuffer("hhttps://mcpeversions.sirherobrine23.org//bedrock/latest").then(res => res.toString("utf8")));
    } else {
      bedrockData = JSON.parse(await fetchBuffer(`https://mcpeversions.sirherobrine23.org/bedrock/search?version=${Version}`).then(res => res.toString("utf8")));
    }
    if (!bedrockData) throw new Error("No version found");
    return {
      version: bedrockData.version,
      url: bedrockData[Os][Arch],
      datePublish: new Date(bedrockData.datePublish),
      raw: bedrockData
    };
  } else if (server === "java") {
    let javaData: Root["versions"]["java"][0] = undefined;
    if (Version === "latest"||typeof Version === "boolean") {
      javaData = JSON.parse(await fetchBuffer("https://mcpeversions.sirherobrine23.org/java/latest").then(res => res.toString("utf8")));
    } else {
      javaData = JSON.parse(await fetchBuffer(`https://mcpeversions.sirherobrine23.org/java/search?version=${Version}`).then(res => res.toString("utf8")));
    }
    if (!javaData) throw new Error("No version found");
    return {
      version: javaData.version,
      url: javaData.javaJar,
      datePublish: new Date(javaData.datePublish),
      raw: javaData
    };
  } else if (server === "pocketmine") {
    let pocketmineData: Root["versions"]["pocketmine"][0] = undefined;
    if (Version === "latest"||typeof Version === "boolean") {
      pocketmineData = JSON.parse(await fetchBuffer("https://mcpeversions.sirherobrine23.org/pocketmine/latest").then(res => res.toString("utf8")));
    } else {
      pocketmineData = JSON.parse(await fetchBuffer(`https://mcpeversions.sirherobrine23.org/pocketmine/search?version=${Version}`).then(res => res.toString("utf8")));
    }
    if (!pocketmineData) throw new Error("No version found");
    return {
      version: pocketmineData.version,
      url: pocketmineData.pocketminePhar,
      datePublish: new Date(pocketmineData.datePublish),
      raw: pocketmineData
    };
  } else if (server === "spigot") {
    let spigotData: Root["versions"]["spigot"][0] = undefined;
    if (Version === "latest"||typeof Version === "boolean") {
      spigotData = JSON.parse(await fetchBuffer("https://mcpeversions.sirherobrine23.org/spigot/latest").then(res => res.toString("utf8")));
    } else {
      spigotData = JSON.parse(await fetchBuffer(`https://mcpeversions.sirherobrine23.org/spigot/search?version=${Version}`).then(res => res.toString("utf8")));
    }
    if (!spigotData) throw new Error("No version found");
    return {
      version: spigotData.version,
      url: spigotData.spigotJar,
      datePublish: new Date(spigotData.datePublish),
      raw: spigotData
    };
  }
  throw new Error("Server not found");
}

/**
 * Look for a server version supported by Bds Core. returning an Object with the publication date and the file's Buffer.
 * 
 * @param server - Bds Core Platform.
 * @param Version - Version of server, any type of boolean to get latest version or `latest` to get latest version.
 * @param Arch - Architecture of server.
 * @param Os - Operating system of server.
 * @returns Object with the publication date and the file's Buffer.
 */
export async function getBuffer(server: BdsCorePlatforms, Version: string|boolean, Arch?: string, Os?: string): Promise<{datePublish: Date; dataBuffer: Buffer;}> {
  const {datePublish, url} = await findUrlVersion(server, Version, Arch, Os);
  return {
    datePublish: datePublish,
    dataBuffer: await fetchBuffer(url)
  };
}

/**
 * Get All Versions of a server.
 * 
 * @param server - Bds Core Platform.
 * @returns Server Platform with data registered in database.
 */
export async function getAllVersions(server: BdsCorePlatforms) {
  const RootData = JSON.parse(await fetchBuffer("https://version_api.bdsmaneger.com/").then(res => res.toString("utf8"))) as Root;
  if (server === "bedrock") {
    return RootData.versions.bedrock;
  } else if (server === "pocketmine") {
    return RootData.versions.pocketmine;
  } else if (server === "java") {
    return RootData.versions.java;
  } else if (server === "spigot") {
    return RootData.versions.spigot;
  }
  throw new Error("Invalid server");
}
