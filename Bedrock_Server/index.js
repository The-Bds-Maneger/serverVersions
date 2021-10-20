const HTTP_Request = require("../HTTP_Request");
const cli_color = require("cli-color");
const fs = require("fs");
const path = require("path");
const actions_core = require("@actions/core");
const CommitMessage = require("../lib/GitCommit");

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
  console.log(cli_color.green("[+]"), "Starting Find New Version to Minecraft Bedrock Server");
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
  const OldSeverVersions = require(path.resolve(__dirname, "../bedrock/server.json"));
  const NewSeverVersions = {
    latest: "",
    versions: {}
  }

  if (OldSeverVersions.versions[MinecraftVersion]) {
    // Print the latest version
    console.log(cli_color.yellow("[!]"), "Minecraft Bedrock is up to date");
    
    // Export new versions to action
    actions_core.exportVariable("bedrock", OldSeverVersions.latest);
    
    // return false
    return false;
  }
  actions_core.exportVariable("COMMIT_CHANGES", true);
  NewSeverVersions.versions[MinecraftVersion] = Version;
  NewSeverVersions.latest = MinecraftVersion;
  CommitMessage.AddText(`[+] Minecraft Bedrock Server ${OldSeverVersions.latest} -> ${MinecraftVersion}`);

  // Print the latest version
  console.log(cli_color.green("[+]"), "Minecraft Bedrock Update to Version", cli_color.yellowBright(MinecraftVersion));

  // Add old versions to new versions
  Object.keys(OldSeverVersions.versions).forEach(version => NewSeverVersions.versions[version] = OldSeverVersions.versions[version]);

  // Write new versions to Bedrock Server.json file
  fs.writeFileSync(path.resolve(__dirname, "../bedrock/server.json"), JSON.stringify(NewSeverVersions, null, 2));
  
  // Export new versions to action
  actions_core.exportVariable("bedrock", MinecraftVersion);

  // Return Version
  return MinecraftVersion;
}

module.exports.main = main;
