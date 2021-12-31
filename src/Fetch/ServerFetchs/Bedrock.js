const HTTP_Request = require("../HTTP_Request");

async function MainRequest() {
  const Htmll = (await HTTP_Request.HTML_URLS("https://www.minecraft.net/en-us/download/server/bedrock")).filter(d => /bin-/.test(d));
  const Version = {
    linux: {
      x64: null,
      aarch64: null
    },
    win32: {
      x64: null,
      aarch64: null
    },
    darwin: {
      x64: null,
      aarch64: null
    }
  };

  Htmll.forEach(urls => {
    if (/win/.test(urls)) {
      if (/arm64|arm|aarch64/gi.test(urls)) Version.win32.aarch64 = urls;
      else Version.win32.x64 = urls;
    } else if (/linux/.test(urls)) {
      if (/aarch64|arm64|arm/.test(urls)) Version.linux.aarch64 = urls;
      else Version.linux.x64 = urls;
    } else if (/darwin/.test(urls)) {
      if (/aarch64|arm64|arm/.test(urls)) Version.darwin.aarch64 = urls;
      else Version.darwin.x64 = urls;
    }
  });

  const MinecraftVersion = Htmll[0].replace(/[a-zA-Z:\/\-]/gi, "").replace(/^\.*/gi, "").replace(/\.*$/gi, "").trim();
  const __data = {
    version: MinecraftVersion,
    Date: new Date(),
    data: Version
  };
  return __data;
}

if (require.main === module) MainRequest().then(console.log).catch(console.error);
else module.exports.main = MainRequest;
module.exports.platform = "bedrock";