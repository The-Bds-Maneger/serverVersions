const HTTP_Request = require("../HTTP_Request");
const cli_color = require("cli-color");
const fs = require("fs");
const path = require("path");
const actions_core = require("@actions/core");
const JSON_HTTP = async (...args) => JSON.parse(await HTTP_Request.RAW_TEXT(...args));
const CommitMessage = require("../lib/GitCommit");

async function main() {
  console.log("");
  console.log(cli_color.green("[+]"), "Starting Find New Version to Pocketmine-MP");
  const version = await JSON_HTTP("https://api.github.com/repos/pmmp/PocketMine-MP/releases?per_page=100");
  const OldVersion = require("../pocketmine/server.json");

  if (version[0].tag_name === OldVersion.latest) {
    console.log(cli_color.yellow("[!]") + " Pocketmine-MP is up to date");
    actions_core.exportVariable("pocketmine", OldVersion.latest);
    return false;
  } else {
    actions_core.exportVariable("COMMIT_CHANGES", true);
    const NewVersion = {
      latest: version[0].tag_name,
      versions: {}
    };
    version.forEach(release => {
      if (release.tag_name !== OldVersion.versions[release.tag_name]) {
        const Assents = release.assets.filter(asset => asset.name.endsWith(".phar"));
        if (Assents.length >= 1) {
          NewVersion.versions[release.tag_name] = {
            data: release.published_at,
            url: Assents[0].browser_download_url
          }
        } else console.log(cli_color.red("[-]") + " No assents found for " + release.tag_name);
      }
    });
    Object.keys(OldVersion.versions).forEach(version => NewVersion.versions[version] = OldVersion.versions[version]);
    fs.writeFileSync(path.join(__dirname, "../pocketmine/server.json"), JSON.stringify(NewVersion, null, 2));
    console.log(cli_color.green("[+]") + " Pocketmine-MP is updated to " + NewVersion.latest);
    CommitMessage.AddText(`[+] Pocketmine-MP ${OldVersion.latest} -> ${NewVersion.latest}`);
    actions_core.exportVariable("pocketmine", NewVersion.latest);
    return NewVersion.latest;
  }
}

module.exports.main = main;
