const HTTP_Request = require("../HTTP_Request");
const cli_color = require("cli-color");

async function MinecraftNetRequest(Host = "") {
  const Request = await HTTP_Request.RAW_TEXT(Host,  {
    headers: {
      "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
      "connection": "keep-alive",
      "cache-control": "max-age=0",
      "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
      "sec-ch-ua-mobile": "?0",
      "upgrade-insecure-requests": "1",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "sec-fetch-site": "none",
      "sec-fetch-mode": "navigate",
      "sec-fetch-user": "?1",
      "sec-fetch-dest": "document",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9,en-US;q=0.8,en;q=0.7",
    }
  });

  return Request.split(/["']/gi).filter(d=>/^http[s]:/.test(d.trim()));
}

async function main() {
  console.log("");
  const Htmll = (await MinecraftNetRequest("https://www.minecraft.net/en-us/download/server/bedrock")).filter(d => /bin-/.test(d));
  const Version = {
    data: new Date(),
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
    data: Version
  };
  console.log(cli_color.greenBright("[Bedrock]"), cli_color.yellowBright("Version: "), cli_color.greenBright(__data.version), "\n", cli_color.yellowBright(JSON.stringify(__data.data, null, 2)));
  return __data;
}

module.exports.main = main;
