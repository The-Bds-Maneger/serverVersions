const HTTP_Request = require("../HTTP_Request");
const cli_color = require("cli-color");

const Versions = require("../../Versions.json");

async function main() {
  console.log("");
  const ReleaseArray = [...(await HTTP_Request.RAW_TEXT("https://api.github.com/repos/The-Bds-Maneger/Dragonfly_Build/releases?per_page=100"))];
  const mapVersion = ReleaseArray.map(Release => {
    const Version = Release.tag_name;
    const JJ = {
      data: new Date(Release.published_at),
      linux: {aarch64: null, armv7: null, x64: null, i386: null},
      win32: {aarch64: null, x64: null, i386: null},
      darwin: {aarch64: null, x64: null},
      android: {aarch64: null, x64: null}
    };
    Release.assets.forEach(Asset => {
      const NameFile = Asset.name;
      // Windows
      if (/win32/gi.test(NameFile)) {
        if (/amd64/gi.test(NameFile)) JJ.win32.x64 = Asset.browser_download_url;
        else if (/arm64/gi.test(NameFile)) JJ.win32.aarch64 = Asset.browser_download_url;
        else if (/386/gi.test(NameFile)) JJ.win32.i386 = Asset.browser_download_url;
        else console.log(cli_color.red("Error: ") + "Unknown win32 version: " + NameFile);
      }
      // Linux
      else if (/linux/gi.test(NameFile)) {
        if (/amd64/gi.test(NameFile)) JJ.linux.x64 = Asset.browser_download_url;
        else if (/arm64/gi.test(NameFile)) JJ.linux.aarch64 = Asset.browser_download_url;
        else if (/arm/gi.test(NameFile)) JJ.linux.armv7 = Asset.browser_download_url;
        else if (/x64/gi.test(NameFile)) JJ.linux.x64 = Asset.browser_download_url;
        else if (/386/gi.test(NameFile)) JJ.linux.i386 = Asset.browser_download_url;
        else console.log(cli_color.red("Error: ") + "Unknown linux version: " + NameFile);
      }
      // MacOS
      else if (/darwin/gi.test(NameFile)) {
        if (/amd64/gi.test(NameFile)) JJ.darwin.x64 = Asset.browser_download_url;
        else if (/arm64/gi.test(NameFile)) JJ.darwin.aarch64 = Asset.browser_download_url;
        else console.log(cli_color.red("Error: ") + "Unknown darwin version: " + NameFile);
      }
      // Android
      else if (/android/gi.test(NameFile)) {
        if (/amd64/gi.test(NameFile)) JJ.android.x64 = Asset.browser_download_url;
        else if (/arm64/gi.test(NameFile)) JJ.android.aarch64 = Asset.browser_download_url;
        else console.log(cli_color.red("Error: ") + "Unknown android version: " + NameFile);
      }
      // No system detected
      else console.log(cli_color.red("Error: ") + "Unknown version: " + NameFile);
    });
    return {
      Version: String(Version),
      Object: JJ
    };
  });

  return mapVersion.filter(Version => {
    let a = Versions.platform.filter(Platform => Platform.name === "dragonfly").filter(Platform => Platform.version === Version.Version);
    if (a.length === 0) return true;
    return false;
  });

}

module.exports.main = main;
