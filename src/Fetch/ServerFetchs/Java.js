const HTTP_Request = require("../HTTP_Request");
const cli_color = require("cli-color");
const fs = require("fs");
const actions_core = require("@actions/core");

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

  return Request;
}

async function main() {
  console.log("");
  console.log(cli_color.green("[+]"), "Starting Find New Version to Minecraft Java");
  const HTML_ARRAY = (await MinecraftNetRequest("https://www.minecraft.net/en-us/download/server")).split(/["'<>]|\n|\t/gi).map(a => a.trim()).filter(a => a).filter(a => /server.*\.jar/.test(a));
  
  const Version = HTML_ARRAY.filter(a => /[0-9\.]\.jar/.test(a)).map(a => a.split(/[a-zA-Z\.]/gi).map(a => a.trim()).filter(a => /[0-9]/.test(a)).join(".")).filter(a => a)[0];
  const URL_JAR = HTML_ARRAY.filter(ver => /http[s]:\/\/.*\.jar/.test(ver))[0]

  const VersionObject = {
    data: new Date(),
    url: URL_JAR
  }
  const OldSeverVersions = require("../../java/server.json");
  const NewSeverVersions = {
    latest: "Version",
    versions: {}
  };

  if (OldSeverVersions.versions[Version]) {
    // Print the latest version
    console.log(cli_color.yellow("[!]"), "Minecraft Java is up to date");
    
    // Export new versions to action
    actions_core.exportVariable("java", OldSeverVersions.latest);
    
    // return old version
    return false;
  }

  actions_core.exportVariable("COMMIT_CHANGES", true);

  // Print the latest version
  console.log(cli_color.green("[+]"), "Minecraft Java is update to", Version);

  // Export new versions to action
  actions_core.exportVariable("java", Version);

  // Add Version to new versions
  NewSeverVersions.latest = Version;
  NewSeverVersions.versions[Version] = VersionObject;

  // Add old version to new versions
  Object.keys(OldSeverVersions.versions).forEach(a => NewSeverVersions.versions[a] = OldSeverVersions.versions[a]);

  // Save new versions to file
  fs.writeFileSync("../../java/server.json", JSON.stringify(NewSeverVersions, null, 2));

  // return new version
  return Version;
}

module.exports.main = main;