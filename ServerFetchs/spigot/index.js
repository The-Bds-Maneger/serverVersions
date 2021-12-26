const HTTP_Request = require("../../HTTP_Request");
const cli_color = require("cli-color");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const actions_core = require("@actions/core");
const CommitMessage = require("../../lib/GitCommit");

async function main() {
  console.log("");
  console.log(cli_color.green("[+]"), "Starting Find New Version to Minecraft Spigot");
  const OldVersion = require("../../spigot/server.json");
  const NewVersion = {
    latest: "",
    versions: {}
  };
  // Map Document Array
  let Versions = [{version: "", url: "", data: new Date()}];
  Versions = [];
  const { document } = new JSDOM(await HTTP_Request.RAW_TEXT("https://getbukkit.org/download/spigot")).window;
  document.querySelectorAll("#download > div > div > div > div").forEach(DOM => {
    const New_Dom = {
      version: DOM.querySelector("div:nth-child(1) > h2").innerHTML.trim(),
      url: DOM.querySelector("div:nth-child(4) > div:nth-child(2) > a").href,
      data: new Date(DOM.querySelector("div:nth-child(3) > h3").innerHTML.trim())
    }
    Versions.push(New_Dom)
  });
  if (OldVersion.latest === undefined || OldVersion.latest === Versions[0].version) {
    console.log(cli_color.yellow("[!]"), "Spigot is up to date");
    actions_core.exportVariable("spigot", OldVersion.latest);
    return false;
  }
  actions_core.exportVariable("COMMIT_CHANGES", true);
  NewVersion.latest = Versions[0].version;
  Versions.forEach(Version => {
    if (!OldVersion.versions[Version.version]) {
      console.log(cli_color.green("[+]"), "Spigot:", Version.version);
      NewVersion.versions[Version.version] = {
        url: Version.url,
        data: Version.data
      }
    }
  });
  Object.keys(OldVersion.versions).forEach(Version => NewVersion.versions[Version] = OldVersion.versions[Version]);
  fs.writeFileSync(path.join(__dirname, "../../spigot/server.json"), JSON.stringify(NewVersion, null, 2));
  console.log(cli_color.green("[+]"), "New version found", NewVersion.latest);
  CommitMessage.AddText(`[+] Spigot ${OldVersion.latest} -> ${NewVersion.latest}`);
  actions_core.exportVariable("spigot", NewVersion.latest);
  return NewVersion.latest;
}

module.exports.main = main;
