import log from "../logging";
import * as httpRequest from "../HTTP_Request";
import { java } from "../../model/java";
import { javaRelease } from "./types/Java";

async function Add(Version: string, versionDate: Date, url: string) {
  if (await java.findOne({ version: Version }).lean().then(data => !!data).catch(() => true)) log("java", "Java: version (%s) already exists", Version);
  else {
    log("java", "Java: Version %s, url %s", Version, url);
    await java.create({
      version: Version,
      datePublish: versionDate,
      isLatest: false,
      javaJar: url
    });
  }
}

async function Find() {
  const Versions = await httpRequest.getJson("https://launchermeta.mojang.com/mc/game/version_manifest_v2.json") as {latest: {release: string, snapshot: string, }, versions: Array<{id: string, type: "snapshot"|"release", url: string, time: string, releaseTime: string, sha1: string, complianceLevel: number}>}
  for (const ver of Versions.versions.filter(a => a.type === "release")) {
    const Release = await httpRequest.getJson(ver.url) as javaRelease;
    if (!!Release?.downloads?.server?.url) await Add(ver.id, new Date(ver.releaseTime), Release?.downloads?.server?.url);
  }
  return await java.findOneAndUpdate({version: Versions.latest.release}, {$set: {isLatest: true}}).lean();
}

export default async function UpdateDatabase() {
  const latestVersion = await java.findOneAndUpdate({isLatest: true}, {$set: {isLatest: false}}).lean();
  return {
    new: await Find(),
    old: latestVersion
  };
}