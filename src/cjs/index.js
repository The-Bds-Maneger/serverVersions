const Axios = require("axios");
const fs = require("fs");
const path = require("path");

// Create Function Object Modules
const GithubRawUrl = "https://raw.githubusercontent.com/The-Bds-Maneger/ServerVersions/main";
const Mod = {};

Mod.Find = function(ServerVersion = "latest", ServerPlatform = "bedrock") {
  let VersionsList = require("../Versions.json");
  VersionsList = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../Versions.json"), "utf8"));
  if (typeof ServerVersion !== "string") throw new Error("ServerVersion must be a string");
  if (typeof ServerPlatform !== "string") throw new Error("ServerPlatform must be a string");
  ServerVersion = ServerVersion.toLowerCase(); ServerPlatform = ServerPlatform.toLowerCase();
  if (ServerVersion === "latest") {
    ServerVersion = VersionsList.latest[ServerPlatform];
  }
  // Script

  const VersionFiltred = (VersionsList.platform.filter(SV => SV.version === ServerVersion && SV.name === ServerPlatform))[0];
  if (VersionFiltred === undefined) throw new Error("Version not found");
  const DataReturn = {
    ".raw": VersionFiltred,
    url: "",
    GetBuffer: async () => {
      const Buffer = await Axios.get(DataReturn.url, { responseType: "arraybuffer" });
      return Buffer.data;
    },
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
    const PlatformFiltred = Object.keys(VersionFiltred.data).filter(Platform => !Platform);
    throw new Error(`Platform ${PlatformFiltred} not found`);
  }
  return DataReturn;
}

Mod.FindAsync = async function(ServerVersion = "latest", ServerPlatform = "bedrock") {
  const VersionsList = (await Axios.get(`${GithubRawUrl}/src/Versions.json`)).data;
  fs.writeFileSync(path.resolve(__dirname, "../Versions.json"), JSON.stringify(VersionsList, null, 2));
  if (typeof ServerVersion !== "string") throw new Error("ServerVersion must be a string");
  if (typeof ServerPlatform !== "string") throw new Error("ServerPlatform must be a string");
  ServerVersion = ServerVersion.toLowerCase(); ServerPlatform = ServerPlatform.toLowerCase();
  if (ServerVersion === "latest") {
    ServerVersion = VersionsList.latest[ServerPlatform];
  }
  // Script

  const VersionFiltred = (VersionsList.platform.filter(SV => SV.version === ServerVersion && SV.name === ServerPlatform))[0];
  if (VersionFiltred === undefined) throw new Error("Version not found");
  const DataReturn = {
    ".raw": VersionFiltred,
    url: "",
    GetBuffer: async () => {
      const Buffer = await Axios.get(DataReturn.url, { responseType: "arraybuffer" });
      return Buffer.data;
    },
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
    const PlatformFiltred = Object.keys(VersionFiltred.data).filter(Platform => !Platform);
    throw new Error(`Platform ${PlatformFiltred} not found`);
  }
  return DataReturn;
}

// Export Modules
module.exports = Mod;