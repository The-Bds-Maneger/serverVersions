import { fetchBuffer } from "./fetchVersion/HTTP_Request";
import bedrock, {bedrockSchema as typeBedrock} from "./model/bedrock";
import pocketmine, {pocketminemmpSchema as typePocketmine} from "./model/pocketmine";
import java, {javaSchema as typeJava} from "./model/java";
import spigot, {spigotSchema as typeSpigot} from "./model/spigot";
export type arch = "x64"|"arm64"|"arm"|"ia32"|"mips"|"mipsel"|"ppc"|"ppc64"|"s390"|"s390x"|"x32";
export type osPlatform = "darwin"|"win32"|"linux"|"android";
export type BdsCorePlatforms = "bedrock"|"java"|"pocketmine"|"spigot";
export type bedrockSchemas = typeBedrock;
export type javaSchemas = typeJava;
export type pocketminemmpSchemas = typePocketmine
export type spigotSchemas = typeSpigot;

export default findUrlVersion;
/**
 * Search for a platform version of Bds Core, returning the file url and the publication date.
 * 
 * @param server - Bds Core Platform.
 * @param Version - Version of server, any type of boolean to get latest version or `latest` to get latest version.
 * @param Arch - Architecture of server, default is of host machine.
 * @param osPlatform - System platform of server, default is of host machine.
 * @returns Server Platform with url to download and date published.
 */
export async function findUrlVersion(server: BdsCorePlatforms, Version: string|boolean, Arch: arch = process.arch as arch, osPlatform: osPlatform = process.platform as osPlatform): Promise<{version: string; url: string; datePublish: Date; raw: typeBedrock|typeJava|typePocketmine|typeSpigot}> {
  const findObject: {version?: string; isLatest?: true|false;} = {};
  if (typeof Version === "boolean") {findObject.isLatest = true; delete findObject.version;}
  else {delete findObject.isLatest; if (typeof Version === "string") findObject.version = Version; else throw new Error("Version must be a string or boolean");}
  if (server === "bedrock") {
    const dataBedrock = await bedrock.findOne(findObject).lean();
    if (dataBedrock) {
      if (!!dataBedrock[osPlatform]) {
        if (!!dataBedrock[osPlatform][Arch]) {
          return {
            version: dataBedrock.version,
            url: dataBedrock[osPlatform][Arch],
            datePublish: dataBedrock.datePublish,
            raw: dataBedrock
          };
        }
        throw new Error("Arch not found");
      }
      throw new Error("osPlatform not found");
    }
  } else if (server === "pocketmine") {
    const dataJava = await pocketmine.findOne(findObject).lean();
    if (dataJava) {
      return {
        version: dataJava.version,
        url: dataJava.pocketminePhar,
        datePublish: dataJava.datePublish,
        raw: dataJava
      };
    }
  } else if (server === "java") {
    const dataJava = await java.findOne(findObject).lean();
    if (dataJava) {
      return {
        version: dataJava.version,
        url: dataJava.javaJar,
        datePublish: dataJava.datePublish,
        raw: dataJava
      };
    }
  } else if (server === "spigot") {
    const dataSpigot = await spigot.findOne(findObject).lean();
    if (dataSpigot) {
      return {
        version: dataSpigot.version,
        url: dataSpigot.spigotJar,
        datePublish: dataSpigot.datePublish,
        raw: dataSpigot
      };
    }
  }
  throw new Error("Version not found or invalid server");
}

/**
 * Look for a server version supported by Bds Core. returning an Object with the publication date and the file's Buffer.
 * 
 * @param server - Bds Core Platform.
 * @param Version - Version of server, any type of boolean to get latest version or `latest` to get latest version.
 * @param Arch - Architecture of server, default is of host machine.
 * @param osPlatform - System platform of server, default is of host machine.
 * @returns Object with the publication date and the file's Buffer.
 */
export async function getBuffer(server: BdsCorePlatforms, Version: string|boolean, Arch: arch = process.arch as arch, osPlatform: osPlatform = process.platform as osPlatform): Promise<{datePublish: Date; dataBuffer: Buffer;}> {
  const {datePublish, url} = await findUrlVersion(server, Version, Arch, osPlatform);
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
  if (server === "bedrock") {
    return bedrock.find({}).lean();
  } else if (server === "pocketmine") {
    return pocketmine.find({}).lean();
  } else if (server === "java") {
    return java.find({}).lean();
  } else if (server === "spigot") {
    return spigot.find({}).lean();
  }
  throw new Error("Invalid server");
}