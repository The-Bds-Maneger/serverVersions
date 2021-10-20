#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const action_core = require("@actions/core");
const CommitMessage = require("./lib/GitCommit");

async function RunServerFinds() {
  const Folders = fs.readdirSync(path.resolve(__dirname)).map(folder => path.resolve(__dirname, folder)).filter(folder => fs.statSync(folder).isDirectory()).filter(Folder => Folder.includes("_Server"));
  action_core.exportVariable("COMMIT_CHANGES", false);
  for (let Server of Folders){
    if (fs.existsSync(path.resolve(Server, "index.js"))){
      const ServerVersion = require(Server);
      if (typeof ServerVersion.main === "function") {
        try {await ServerVersion.main();} catch (e) {
          console.log(`Error in ${Server}`);
          console.log(String(e));
        }
      }
    }
  }
}

RunServerFinds().then(() => {
  console.log("Finished");
  CommitMessage.writeText();
});
