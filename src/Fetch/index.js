#!/usr/bin/env node
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const action_core = require("@actions/core");
const cli_color = require("cli-color");

async function RunMain() {
  const OldVersions = require("../Versions.json");
  const Versions = {
    latest: OldVersions.latest,
    platform: [],
  };
  let CommitChanges = false;
  for (const ServerFile of fs.readdirSync(path.resolve(__dirname, "./ServerFetchs")).map(a => path.resolve(__dirname, "./ServerFetchs", a))) {
    const ServerFetch = require(ServerFile);
    const Data = await ServerFetch.main();
    if (typeof Data === "object") {
      if (typeof Data.map === "function") {
        Versions.latest[ServerFetch.platform] = Data[0].Version;
        for (let DataItem of Data) {
          if (!(OldVersions.platform.find(Version => Version.version === DataItem.Version))) {
            CommitChanges = true;
            console.log(cli_color.greenBright(`${ServerFetch.platform}: Add new version ${DataItem.Version}`));
            Versions.platform.push({
              name: ServerFetch.platform,
              ...DataItem,
            });
          }
        }
      } else if (typeof Data.Version === "string") {
        if (!(OldVersions.platform.find(Version => Version.version === Data.Version))) {
          CommitChanges = true;
          console.log(cli_color.greenBright(`${ServerFetch.platform}: Add new version ${Data.Version}`));
          Versions.latest[ServerFetch.platform] = Data.Version;
          Data.version = Data.Version;
          delete Data.Version;
          Versions.platform.push({
            name: ServerFetch.platform,
            ...Data,
          });
        }
      }  else if (typeof Data.version === "string") {
        if (!(OldVersions.platform.find(Version => Version.version === Data.version))) {
          CommitChanges = true;
          console.log(cli_color.greenBright(`${ServerFetch.platform}: Add new version ${Data.version}`));
          Versions.latest[ServerFetch.platform] = Data.version;
          Versions.platform.push({
            name: ServerFetch.platform,
            ...Data,
          });
        }
      }
    }
  }
  Versions.platform.push(...OldVersions.platform);
  const FixedVersions = {
    latest: Versions.latest,
    platform: Versions.platform.map(Version => {
      if (typeof Version.Date === "string") Version.Date = new Date(Version.Date).toUTCString();
      else Version.Date = Version.Date.toUTCString();
      const { name, version, Version: VersionR, Date: DateR, data } = Version;
      return {
        name: String(name),
        version: String(VersionR || version),
        Date: String(DateR),
        data: data
      };
    })
  };
  console.log(cli_color.greenBright("Saving Versions.json"));
  fs.writeFileSync(path.resolve(__dirname, "../Versions.json"), JSON.stringify(FixedVersions, null, 2));
  action_core.exportVariable("COMMIT_CHANGES", CommitChanges ? "true" : "false");
  if (CommitChanges) {
    const ArgsCommit = ["-m", "Server Versions"];
    if (OldVersions.latest.bedrock !== FixedVersions.latest.bedrock) ArgsCommit.push("-m", `Bedrock ${OldVersions.latest.bedrock} to ${FixedVersions.latest.bedrock}`);
    if (OldVersions.latest.dragonfly !== FixedVersions.latest.dragonfly) ArgsCommit.push("-m", `Dragonfly ${OldVersions.latest.dragonfly} to ${FixedVersions.latest.dragonfly}`);
    if (OldVersions.latest.java !== FixedVersions.latest.java) ArgsCommit.push("-m", `Java ${OldVersions.latest.java} to ${FixedVersions.latest.java}`);
    if (OldVersions.latest.pocketmine !== FixedVersions.latest.pocketmine) ArgsCommit.push("-m", `Pocketmine-MP ${OldVersions.latest.pocketmine} to ${FixedVersions.latest.pocketmine}`);
    if (OldVersions.latest.spigot !== FixedVersions.latest.spigot) ArgsCommit.push("-m", `Spigot: ${OldVersions.latest.spigot} to ${FixedVersions.latest.spigot}`);
    child_process.execFileSync("git", ["add", path.resolve(__dirname, "../Versions.json")], {cwd: path.resolve(__dirname, "../.."), stdio: "inherit"});
    child_process.execFileSync("git", [ "commit", ...ArgsCommit ], {cwd: path.resolve(__dirname, "../.."), stdio: "inherit"});
  }
  return FixedVersions;
}

RunMain().catch(err => {
  console.log(err);
  process.exit(1);
}).then(() => {
  process.exit(0);
});