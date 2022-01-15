const Axios = require("axios");
const util = require("util");
const fs = require("fs");
const path = require("path");

// Create Function Object Modules
let Branch = "main"
if (process.env.BDS_VERSION_CI_TEST === "true") {
  Branch = (process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || process.env.GITHUB_REF).replace(/^.*\/.*\//, "");
  console.log(`Bds Version test Branch: ${Branch}`);
}
const GithubRawUrl = `https://raw.githubusercontent.com/The-Bds-Maneger/ServerVersions/${Branch}`;
const Mod = {};

function MainFunctionFind(ServerVersion = "latest", ServerPlatform = "bedrock", VersionsList = require("../Versions.json")) {
  if (typeof ServerPlatform !== "string") throw new Error("ServerPlatform must be a string");
  
  if (typeof ServerVersion !== "string") throw new Error("ServerVersion must be a string");
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
  const DataReturn = {
    url: "",
    version: "",
    Date: new Date(),
    raw_request: VersionFiltred
  }
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
  return DataReturn;
}

/**
 * Get local server versions
 */
function ListVersions() {
  let Versions = require("../Versions.json");
  Versions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../Versions.json"), "utf8"));
  return Versions;
}
Mod.list = ListVersions;

/**
 * Get latest server versions with async, returning an object with the latest server versions, in addition to updating the file locally
 */
async function listAsync() {
  let VersionsList = Mod.list();
  VersionsList = (await Axios.get(`${GithubRawUrl}/src/Versions.json`)).data;
  fs.writeFileSync(path.resolve(__dirname, "../Versions.json"), JSON.stringify(VersionsList, null, 2));
  return VersionsList;
}
Mod.listAsync = listAsync;

/**
 * Get latest server versions with callback, returning an object with the latest server versions, in addition to updating the file locally
 */
Mod.listCallback = (Callback = (err = null, data) => console.log(err, data)) => {
  Mod.listAsync().then(data => Callback(null, data)).catch(err => Callback(err));
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
Mod.find = (ServerVersion = "latest", ServerPlatform = "bedrock") => MainFunctionFind(ServerVersion, ServerPlatform, ListVersions());

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
Mod.findCallback = function (ServerVersion = "latest", ServerPlatform = "bedrock", Callback = (err = null, Data = Mod.find()) => console.log(err, Data)) {
  Mod.listCallback((err, data) => {
    if (err) return Callback(err);
    try {
      Callback(null, MainFunctionFind(ServerVersion, ServerPlatform, data));
    } catch (errFind) {
      Callback(errFind);
    }
  });
}

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
Mod.findAsync = util.promisify(Mod.findCallback);

/**
 * Old Style Mode
 * 
 */
async function OldStyleMode() {
  const PlatformsObject = {};
  const VersionsData = await listAsync();
  for (const { version, name: VersionPlatform, Date: VersionDate, data } of VersionsData.platform) {
    if (!PlatformsObject[VersionPlatform]) PlatformsObject[VersionPlatform] = {latest: VersionsData.latest[VersionPlatform], versions: {}};
    const MountVersionObject = {data: VersionDate}
    if (typeof data === "object") Object.keys(data).forEach(Plat => MountVersionObject[Plat] = data[Plat]);
    else MountVersionObject.url = data;
    PlatformsObject[VersionPlatform].versions[version] = MountVersionObject;
  }
  return PlatformsObject;
}
Mod.OldStyleMode = OldStyleMode;

// Export Modules
module.exports = Mod;