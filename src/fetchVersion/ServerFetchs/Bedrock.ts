import * as httpRequest from "../HTTP_Request";
import { bedrockSchema, bedrock } from "../../model/bedrock";
import adm_zip from "adm-zip";

async function Find() {
  const HtmlUrls = (await httpRequest.HTML_URLS("https://www.minecraft.net/en-us/download/server/bedrock")).filter(Link => /bin-.*\.zip/.test(Link));
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
  return __data;
}

export default async function UpdateDatabase() {
  const data = await Find();
  const latestVersion = await bedrock.findOne({ isLatest: true }).lean();
  if (await bedrock.findOne({ version: data.version }).lean().then(data => !data).catch(() => false)) {
    if (data.version !== latestVersion.version) {
      latestVersion.isLatest = false;
      await bedrock.updateOne({ _id: latestVersion._id }, latestVersion);
    }
    await bedrock.create({
      version: data.version,
      datePublish: data.Date,
      isLatest: data.version !== latestVersion.version,
      win32: {
        x64: data.data.win32.x64,
        arm64: data.data.win32.arm64
      },
      linux: {
        x64: data.data.linux.x64,
        arm64: data.data.linux.arm64
      },
      darwin: {
        x64: data.data.darwin.x64,
        arm64: data.data.darwin.arm64
      }
    });
  }
  return {
    new: await bedrock.findOne({ isLatest: true }).lean(),
    old: latestVersion
  };
}