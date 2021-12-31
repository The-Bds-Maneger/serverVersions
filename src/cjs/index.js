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
  const DataReturn = {
    url: "",
    version: "",
    Date: new Date()
  }
  if (typeof ServerPlatform !== "string") throw new Error("ServerPlatform must be a string");

  if (typeof ServerVersion === "string") {
    ServerVersion = ServerVersion.toLowerCase(); ServerPlatform = ServerPlatform.toLowerCase();
    if (ServerVersion === "latest") {
      ServerVersion = VersionsList.latest[ServerPlatform];
    }
    //
    // ------------------------------------------------------------------------------------------------------------
    // Script
    //
    const PlatformFilted = VersionsList.platform.filter(SV => SV.name === ServerPlatform);
    if (PlatformFilted.length === 0) throw new Error(`Platform ${ServerPlatform} not found`);
    const VersionFiltred = PlatformFilted.filter(SV => SV.version === ServerVersion)[0];
    if (VersionFiltred === undefined) throw new Error("Version not found");
    DataReturn.raw_request = VersionFiltred;
    if (typeof VersionFiltred.data === "string") {
      DataReturn.url = VersionFiltred.data;
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
      const Err = new Error("Error getting the version");
      Err.Error_raw = VersionFiltred;
      throw Err;
    }
  } else throw new Error("ServerVersion must be a string");
  return DataReturn;
}

/**
 * Look for a server version with cached files saved from when the package was installed and when the findCallback and findAsync function is used
 * 
 * examples:
 * 
 *  find("1.16.1", "java");
 * 
 *  find("latest", "bedrock");
 * 
 *  find("latest", "java");
 * 
 */
Mod.find = (ServerVersion = "latest", ServerPlatform = "bedrock") => MainFunctionFind(ServerVersion, ServerPlatform, JSON.parse(fs.readFileSync(path.resolve(__dirname, "../Versions.json"), "utf8")));

/**
 * Look for server versions with callback, returning an object with the latest server versions, in addition to updating the file locally
 * 
 * examples:
 * 
 * findCallback("1.16.1", "java", (err, data) => {
 *   if (err) return console.log(err);
 *   console.log(data);
 * });
 * 
 * findCallback("latest", "bedrock", (err, data) => {
 *  if (err) return console.log(err);
 *  console.log(data);
 * });
 */
function findCallback(ServerVersion = "latest", ServerPlatform = "bedrock", Callback = (err = null, Data = {url: String(), GetBuffer: () => Buffer.from("a"), version: String(), Date: Date()}) => console.log(err, Data)) {
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
Mod.findCallback = findCallback;

/**
 * Look for server versions with async, returning an object with the latest server versions, in addition to updating the file locally
 * 
 * examples:
 * 
 *  const Version = await findAsync("1.16.1", "java");
 * 
 *  const Version = await findAsync("latest", "bedrock");
 * 
 *  const Version = await findAsync("latest", "java");
 */
Mod.findAsync = util.promisify(findCallback);

// Export Modules
module.exports = Mod;