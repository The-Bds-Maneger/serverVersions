import cli_color from "cli-color";
import * as httpRequest from "../HTTP_Request";
import { bedrockSchema, bedrock } from "../../model/bedrock";
import adm_zip from "adm-zip";

async function Add(Version: string, versionDate: Date, urlData: {linux: {x64: string, arm64?: string}; win32: {x64: string, arm64?: string}; darwin: {x64?: string, arm64?: string}}) {
  if (await bedrock.findOne({ version: Version }).lean().then(data => !!data).catch(() => true)) console.log(cli_color.redBright("Bedrock: version (%s) already exists"), Version);
  else {
    const Old = await bedrock.findOneAndUpdate({isLatest: true}, {$set: {isLatest: false}});
    console.log(cli_color.redBright("Bedrock: Update version %s, to %s"), Old.version, Version);
    await bedrock.create({
      version: Version,
      datePublish: versionDate,
      isLatest: true,
      win32: urlData.win32,
      linux: urlData.linux,
      darwin: urlData.darwin
    });
  }
}

async function Find() {
  const HtmlUrls = (await httpRequest.HTML_URLS("https://minecraft.net/en-us/download/server/bedrock")).filter(Link => /bin-.*\.zip/.test(Link));
  const urlObject: {linux: bedrockSchema["linux"]; win32: bedrockSchema["win32"]; darwin: bedrockSchema["darwin"]; } = {
    linux: {x64: undefined, arm64: undefined},
    win32: {x64: undefined, arm64: undefined},
    darwin: {x64: undefined, arm64: undefined}
  };

  HtmlUrls.forEach(urls => {
    if (/win/.test(urls)) {
      if (/arm64|arm|aarch64/gi.test(urls)) urlObject.win32.arm64 = urls;
      else urlObject.win32.x64 = urls;
    } else if (/linux/.test(urls)) {
      if (/aarch64|arm64|arm/.test(urls)) urlObject.linux.arm64 = urls;
      else urlObject.linux.x64 = urls;
    } else if (/darwin|macos|mac/.test(urls)) {
      if (/aarch64|arm64|arm/.test(urls)) urlObject.darwin.arm64 = urls;
      else urlObject.darwin.x64 = urls;
    }
  });
  const MinecraftVersion = HtmlUrls[0].match(/([0-9]+\..*).zip/)[1].replace(/[a-zA-Z]/, "");
  const __data = {
    version: MinecraftVersion,
    data: urlObject,
    Date: await new Promise<Date>(async resolve => {
      const zip = new adm_zip(await httpRequest.fetchBuffer(urlObject.linux.x64));
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
