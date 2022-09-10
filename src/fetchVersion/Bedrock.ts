import log from "../lib/logging";
import * as httpRequest from "../lib/HTTP_Request";
import { bedrock } from "../db/bedrock";
import adm_zip from "adm-zip";

async function Add(Version: string, versionDate: Date, urlData: {linux: string, win32: string}) {
  if (await bedrock.findOne({ version: Version }).lean().then(data => !!data).catch(() => true)) log("bedrock", "Bedrock: version (%s) already exists", Version);
  else {
    const Old = await bedrock.findOneAndUpdate({latest: true}, {$set: {latest: false}});
    log("bedrock", "Bedrock: Update version %s, to %s", Old?.version, Version);
    await bedrock.create({
      version: Version,
      date: versionDate,
      latest: true,
      win32: urlData.win32,
      linux: urlData.linux
    });
  }
}

async function Find() {
  const HtmlUrls = (await httpRequest.HTML_URLS("https://minecraft.net/en-us/download/server/bedrock")).filter(Link => /bin-.*\.zip/.test(Link));
  const urlObject: {linux: string, win32: string} = {linux: undefined, win32: undefined};
  HtmlUrls.forEach(url => {
    if (/darwin|macos|mac/.test(url)) console.log("Macos Are now supported: %s", url);
    else if (/win/.test(url)) urlObject.win32 = url;
    else if (/linux/.test(url)) urlObject.linux = url;
  });

  const urlTo = urlObject.win32||urlObject.linux;
  if (!urlTo) throw new Error("cannot get url");
  const MinecraftVersion = urlTo.match(/([0-9]+\..*).zip/)[1].replace(/[a-zA-Z]/, "");
  const __data = {
    version: MinecraftVersion,
    data: urlObject,
    Date: await new Promise<Date>(async resolve => {
      const zip = new adm_zip(await httpRequest.fetchBuffer(urlObject.linux));
      for (const entry of zip.getEntries()) {
        if (entry.entryName === "bedrock_server") return resolve(entry.header.time);
      };
      return resolve(new Date());
    })
  };
  await Add(__data.version, __data.Date, __data.data);
  return __data;
}

export default async function UpdateDatabase() {
  const latestVersion = await bedrock.findOne({ isLatest: true }).lean();
  return {
    new: await Find(),
    old: latestVersion
  };
}
