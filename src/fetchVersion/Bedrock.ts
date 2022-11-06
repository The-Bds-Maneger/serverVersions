import * as httpRequest from "../request/simples";
import * as httpRequestLarge from "../request/large";
import { registerNew } from "../localRegister";

export default async function UpdateDatabase() {
  const minecraftUrls = (await httpRequest.urls("https://minecraft.net/en-us/download/server/bedrock")).filter(link => /bin-.*\.zip/.test(link));
  const linuxArm64 = minecraftUrls.find(link => /linux/.test(link) && /arm64|aarch64/.test(link)), linux = minecraftUrls.find(link => /linux/.test(link) && !/arm64|aarch64/.test(link));
  const darwinArm64 = minecraftUrls.find(link => (/darwin/.test(link)) && /arm64|aarch64/.test(link)), darwin = minecraftUrls.find(link => (/darwin/.test(link)) && !/arm64|aarch64/.test(link));
  const windowsArm64 = minecraftUrls.find(link => (/win/.test(link) && !/darwin/.test(link)) && /arm64|aarch64/.test(link)), windows = minecraftUrls.find(link => (/win/.test(link) && !/darwin/.test(link)) && !/arm64|aarch64/.test(link));
  const [, version] = minecraftUrls[0].match(/\/[a-zA-Z-_]+([0-9\.]+).zip$/);
  const mcpeDate = await new Promise<Date>(async resolve => {
    const zip = await httpRequestLarge.zip({url: minecraftUrls[0]});
    for (const entry of zip.getEntries()) {
      if (entry.entryName.startsWith("bedrock_server")) return resolve(entry.header.time);
    };
    return resolve(new Date());
  });

  return registerNew<"bedrock">({
    bdsPlatform: "bedrock",
    version: version,
    date: mcpeDate,
    url: {
      linux: {
        x64: linux,
        arm64: linuxArm64
      },
      win32: {
        x64: windows,
        arm64: windowsArm64
      },
      darwin: {
        x64: darwin,
        arm64: darwinArm64
      },
    }
  })
}

UpdateDatabase()