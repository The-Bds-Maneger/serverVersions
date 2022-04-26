import * as httpRequest from "../HTTP_Request";
import adm_zip from "adm-zip";

export default async function bedrock() {
  const HtmlUrls = (await httpRequest.HTML_URLS("https://www.minecraft.net/en-us/download/server/bedrock")).filter(Link => /bin-.*\.zip/.test(Link));
  const urlObject = {
    linux: {
      x64: undefined,
      aarch64: undefined
    },
    win32: {
      x64: undefined,
      aarch64: undefined
    },
    darwin: {
      x64: undefined,
      aarch64: undefined
    }
  };

  HtmlUrls.forEach(urls => {
    if (/win/.test(urls)) {
      if (/arm64|arm|aarch64/gi.test(urls)) urlObject.win32.aarch64 = urls;
      else urlObject.win32.x64 = urls;
    } else if (/linux/.test(urls)) {
      if (/aarch64|arm64|arm/.test(urls)) urlObject.linux.aarch64 = urls;
      else urlObject.linux.x64 = urls;
    } else if (/darwin/.test(urls)) {
      if (/aarch64|arm64|arm/.test(urls)) urlObject.darwin.aarch64 = urls;
      else urlObject.darwin.x64 = urls;
    }
  });
  const MinecraftVersion = HtmlUrls[0].match(/([0-9]+\..*).zip/)[1].replace(/[a-zA-Z]/, "");
  const __data = {
    version: MinecraftVersion,
    data: urlObject,
    Date: await new Promise(async resolve => {
      const zip = new adm_zip(await httpRequest.fetchBuffer(urlObject.linux.x64));
      for (const entry of zip.getEntries()) {
        if (entry.entryName === "bedrock_server") return resolve(entry.header.time);
      };
      return resolve(new Date());
    })
  };
  return __data;
}