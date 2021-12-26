#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const action_core = require("@actions/core");
const CommitMessage = require("./lib/GitCommit");

async function RunServerFinds() {
  const Folders = fs.readdirSync(path.resolve(__dirname, "./ServerFetchs")).map(folder => path.resolve(__dirname, "./ServerFetchs", folder)).filter(folder => fs.statSync(folder).isDirectory());
  action_core.exportVariable("COMMIT_CHANGES", false);
  for (let Server of Folders){
    const IndexAction = path.resolve(Server, "index.js");
    if (fs.existsSync(IndexAction)){
      const ServerVersion = require(IndexAction);
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
