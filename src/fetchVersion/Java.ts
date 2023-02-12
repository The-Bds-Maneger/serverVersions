import * as httpRequest from "@sirherobrine23/http";
import {java} from "../db/java.js";
import { javaRelease } from "./types/Java.js";

async function Add(Version: string, versionDate: Date, url: string) {
  if (await java.findOne({ version: Version }).lean().then(data => !!data).catch(() => true)) return;
  await java.create({
    version: Version,
    date: versionDate,
    latest: false,
    url: url
  });
}

async function Find() {
  const Versions = await httpRequest.jsonRequest<{latest: {release: string, snapshot: string, }, versions: Array<{id: string, type: "snapshot"|"release", url: string, time: string, releaseTime: string, sha1: string, complianceLevel: number}>}>("https://launchermeta.mojang.com/mc/game/version_manifest_v2.json").then(r => r.body);
  for (const ver of Versions.versions.filter(a => a.type === "release")) {
    const Release = await httpRequest.jsonRequest<javaRelease>(ver.url).then(r => r.body);
    if (!!Release?.downloads?.server?.url) await Add(ver.id, new Date(ver.releaseTime), Release?.downloads?.server?.url);
  }
  return await java.findOneAndUpdate({version: Versions.latest.release}, {$set: {latest: true}}).lean();
}

export default async function UpdateDatabase() {
  const latestVersion = await java.findOneAndUpdate({latest: true}, {$set: {latest: false}}).lean();
  return {
    new: await Find(),
    old: latestVersion
  };
}