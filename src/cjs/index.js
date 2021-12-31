const Axios = require("axios");
const util = require("util");
const fs = require("fs");
const path = require("path");

// Create Function Object Modules
let Branch = "main"
if (process.env.CI) {
  Branch = process.env.CI_COMMIT_REF_NAME.replace(/.*\/.*\//, "");
  console.log(`Branch: ${Branch}`);
}
if (process.env.rawBranch) Branch = process.env.rawBranch;
const GithubRawUrl = `https://raw.githubusercontent.com/The-Bds-Maneger/ServerVersions/${Branch}`;
const Mod = {};

function MainFunctionFind(ServerVersion = "latest", ServerPlatform = "bedrock", VersionsList = require("../Versions.json")) {
  if (typeof ServerVersion !== "string") throw new Error("ServerVersion must be a string");
  if (typeof ServerPlatform !== "string") throw new Error("ServerPlatform must be a string");
  ServerVersion = ServerVersion.toLowerCase(); ServerPlatform = ServerPlatform.toLowerCase();
  if (ServerVersion === "latest") {
    ServerVersion = VersionsList.latest[ServerPlatform];
  }
  //
  // ------------------------------------------------------------------------------------------------------------
  // Script
  //
  const VersionFiltred = (VersionsList.platform.filter(SV => SV.version === ServerVersion && SV.name === ServerPlatform))[0];
  if (VersionFiltred === undefined) throw new Error("Version not found");
  const DataReturn = {
    ".raw": VersionFiltred,
    url: "",
    version: "",
    Date: new Date(),
  }
  if (typeof VersionFiltred.data.url === "string") {
    DataReturn.url = VersionFiltred.data.url;
    DataReturn.version = VersionFiltred.version;
    DataReturn.Date = new Date(VersionFiltred.Date);
  } else if (typeof VersionFiltred.data[process.platform] === "object") {
    if (typeof VersionFiltred.data[process.platform][process.arch] === "string") {
      DataReturn.url = VersionFiltred.data[process.platform][process.arch];
      DataReturn.version = VersionFiltred.version;
      DataReturn.Date = new Date(VersionFiltred.Date);
    } else {
      const ArchFiltred = Object.keys(VersionFiltred.data[process.platform]).filter(Arch => !Arch);
      throw new Error(`Architecture ${ArchFiltred} not found`);
    }
  } else {
    const PlatformFiltred = Object.keys(VersionFiltred.data).filter(Platform => Platform);
    throw new Error(`Platform ${PlatformFiltred.join(", ")} not found`);
  }
  return DataReturn;
}

/**
 * Look for a server version with cached files saved from when the package was installed and when the findCallback and findAsync function is used
 */
Mod.find = (ServerVersion = "latest", ServerPlatform = "bedrock") => MainFunctionFind(ServerVersion, ServerPlatform, JSON.parse(fs.readFileSync(path.resolve(__dirname, "../Versions.json"), "utf8")));

/**
 * Look for server versions with callback, returning an object with the latest server versions, in addition to updating the file locally
 */
function findVersionCallback(ServerVersion = "latest", ServerPlatform = "bedrock", Callback = (err = null, Data = {url: String(), GetBuffer: () => Buffer.from("a"), version: String(), Date: Date()}) => console.log(err, Data)) {
  new Promise(async resolve => {
    let VersionsList;
    try {
      VersionsList = (await Axios.get(`${GithubRawUrl}/src/Versions.json`)).data;
    } catch (err) {
      const Erro = new Error("Error getting the list of versions");
      Erro.Error_raw = err;
      Callback(Erro);
      return;
    }
    try {
      fs.writeFileSync(path.resolve(__dirname, "../Versions.json"), JSON.stringify(VersionsList, null, 2));
      Callback(null, MainFunctionFind(ServerVersion, ServerPlatform, VersionsList));
    } catch (err) {
      Callback(err);
    }
    resolve();
  });
}
Mod.findCallback = findVersionCallback;

/**
 * Look for server versions with async, returning an object with the latest server versions, in addition to updating the file locally
 */
Mod.findAsync = util.promisify(findVersionCallback);

// Export Modules
module.exports = Mod;