#!/usr/bin/env node
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const action_core = require("@actions/core");
const cli_color = require("cli-color");

async function RunMain() {
  const OldVersions = require("../Versions.json");
  const ArgsCommit = ["commit", "-m", "Server Versions.json Updated"];
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
            ArgsCommit.push("-m", `Add Version to platform ${ServerFetch.platform}, Version: ${DataItem.Version}`);
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
          ArgsCommit.push("-m", `Add Version to platform ${ServerFetch.platform}, Version: ${Data.Version}`);
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
          ArgsCommit.push("-m", `Add Version to platform ${ServerFetch.platform}, Version: ${Data.version}`);
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
  if (CommitChanges) {
    child_process.execFileSync("git", ["add", path.resolve(__dirname, "../Versions.json")], {cwd: path.resolve(__dirname, "../.."), stdio: "inherit"});
    child_process.execFileSync("git", ArgsCommit, {cwd: path.resolve(__dirname, "../.."), stdio: "inherit"});
  }
  action_core.exportVariable("COMMIT_CHANGES", CommitChanges ? "true" : "false");
  return FixedVersions;
}

RunMain().catch(err => {
  console.log(err);
  process.exit(1);
}).then(() => {
  process.exit(0);
});