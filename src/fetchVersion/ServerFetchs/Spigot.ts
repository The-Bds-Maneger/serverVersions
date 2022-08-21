import log from "../logging";
import jsdom from "jsdom";
import * as httpRequest from "../HTTP_Request";
import { spigot } from "../../model/spigot";


async function Add(Version: string, versionDate: Date, url: string) {
  if (await spigot.findOne({ version: Version }).lean().then(data => !!data).catch(() => true)) log("alter", "Spigot: version (%s) already exists", Version);
  else {
    log("alter", "Spigot: Version %s, url %s", Version, url);
    await spigot.create({
      version: Version,
      datePublish: versionDate,
      isLatest: false,
      spigotJar: url
    });
  }
}

async function Find() {
  const Versions = await new Promise<Array<{version: string, Date: Date, url: Array<string>|string}>>(async Resolve => {
    const DataReturn = [];
    const { document } = (new jsdom.JSDOM(await httpRequest.RAW_TEXT("https://getbukkit.org/download/spigot").catch(err => {console.log(err); return "<html></html>"}))).window;
    document.querySelectorAll("#download > div > div > div > div").forEach(DOM => {
      const New_Dom = {
        version: String(DOM.querySelector("div:nth-child(1) > h2").textContent),
        Date: new Date(DOM.querySelector("div:nth-child(3) > h3").textContent),
        url: []
      }
      New_Dom.url.push(`https://download.getbukkit.org/spigot/spigot-${New_Dom.version}.jar`, `https://cdn.getbukkit.org/spigot/spigot-${New_Dom.version}.jar`);
      DataReturn.push(New_Dom)
    });
    return Resolve(DataReturn);
  })
  
  const fetchBool = async (url: string) => await httpRequest.fetchBuffer(url).then(() => true).catch(() => false)
  return await Promise.all(Versions.map(async Version => {
    if (await fetchBool(Version.url[0])) {
      Version.url = String(Version.url[0]);
      await Add(Version.version, Version.Date, Version.url);
      return Version;
    } else if (await fetchBool(Version.url[1])) {
      Version.url = String(Version.url[1]);
      await Add(Version.version, Version.Date, Version.url);
      return Version;
    }
    console.log("Spigot: version (%s) not found, url 1: %s, url 2: %s", Version.version, Version.url[0], Version.url[1]);
    Version.url = "";
    return Version;
  }));
}

export default async function UpdateDatabase() {
  const latestVersion = await spigot.findOneAndUpdate({ isLatest: true }, {$set: {isLatest: false}}).lean();
  const Release = await Find();
  const newRelease = await spigot.findOneAndUpdate({version: Release[0].version}, {$set: {isLatest: true}}).lean();
  return {
    new: newRelease,
    old: latestVersion
  }
}
