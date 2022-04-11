const Requests = require("../HTTP_Request");

async function MainFetch() {
  const ReleaseArray = await Requests.GithubRelease("The-Bds-Maneger/Dragonfly_Build");
  const mapVersion = ReleaseArray.map(Release => {
    const Version = Release.tag_name;
    const DataReturn = {
      Date: new Date(Release.published_at),
      Version: String(Version),
      data: {
        linux: {aarch64: null, armv7: null, x64: null, i386: null},
        win32: {aarch64: null, x64: null, i386: null},
        darwin: {aarch64: null, x64: null},
        android: {aarch64: null, x64: null}
      }
    };

    // Lint Files
    Release.assets.forEach(Asset => {
      const NameFile = Asset.name;
      // Windows
      if (/win32/gi.test(NameFile)) {
        if (/amd64/gi.test(NameFile)) DataReturn.data.win32.x64 = Asset.browser_download_url;
        else if (/arm64/gi.test(NameFile)) DataReturn.data.win32.aarch64 = Asset.browser_download_url;
        else if (/386/gi.test(NameFile)) DataReturn.data.win32.i386 = Asset.browser_download_url;
      }
      // Linux
      else if (/linux/gi.test(NameFile)) {
        if (/amd64/gi.test(NameFile)) DataReturn.data.linux.x64 = Asset.browser_download_url;
        else if (/arm64/gi.test(NameFile)) DataReturn.data.linux.aarch64 = Asset.browser_download_url;
        else if (/arm/gi.test(NameFile)) DataReturn.data.linux.armv7 = Asset.browser_download_url;
        else if (/x64/gi.test(NameFile)) DataReturn.data.linux.x64 = Asset.browser_download_url;
        else if (/386/gi.test(NameFile)) DataReturn.data.linux.i386 = Asset.browser_download_url;
      }
      // MacOS
      else if (/darwin/gi.test(NameFile)) {
        if (/amd64/gi.test(NameFile)) DataReturn.data.darwin.x64 = Asset.browser_download_url;
        else if (/arm64/gi.test(NameFile)) DataReturn.data.darwin.aarch64 = Asset.browser_download_url;
      }
      // Android
      else if (/android/gi.test(NameFile)) {
        if (/amd64/gi.test(NameFile)) DataReturn.data.android.x64 = Asset.browser_download_url;
        else if (/arm64/gi.test(NameFile)) DataReturn.data.android.aarch64 = Asset.browser_download_url;
        
      }
    });
    return DataReturn;
  });

  return mapVersion;
}

if (require.main === module) MainFetch().then(console.log).catch(console.error);
else module.exports.main = MainFetch;
module.exports.platform = "dragonfly";