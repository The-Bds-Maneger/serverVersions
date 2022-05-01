import jsdom from "jsdom";
import * as httpRequest from "../HTTP_Request";
import { spigot } from "../../model/spigot";

async function Find(): Promise<Array<{version: string; Date: Date; url: string;}>> {
  const jsDom = new jsdom.JSDOM(await httpRequest.RAW_TEXT("https://getbukkit.org/download/spigot"));
  const { document } = jsDom.window;
  var Versions = [];
  document.querySelectorAll("#download > div > div > div > div").forEach(DOM => {
    const New_Dom = {
      version: String(DOM.querySelector("div:nth-child(1) > h2").textContent),
      Date: new Date(DOM.querySelector("div:nth-child(3) > h3").textContent),
      url: []
    }
    New_Dom.url.push(`https://download.getbukkit.org/spigot/spigot-${New_Dom.version}.jar`, `https://cdn.getbukkit.org/spigot/spigot-${New_Dom.version}.jar`);
    Versions.push(New_Dom)
  });
  const isExist = [];
  for (const Version of Versions) {
    if (await httpRequest.fetchBuffer(Version.url[0]).then(() => true).catch(() => false)) {
      Version.url = Version.url[0];
      isExist.push(Version);
    } else if (await httpRequest.fetchBuffer(Version.url[1]).then(() => true).catch(() => false)) {
      Version.url = Version.url[1];
      isExist.push(Version);
    }
    else console.log("Spigot: version (%s) not found, url 1: %s, url 2: %s", Version.version, Version.url[0], Version.url[1]);
  }
  return isExist;
}

export default async function UpdateDatabase() {
  const data = await Find();
  const latestVersion = await spigot.findOne({ isLatest: true }).lean();
  latestVersion.isLatest = false;
  await spigot.updateOne({ _id: latestVersion._id }, latestVersion);
  for (const version of data) {
    if (await spigot.findOne({ version: version.version }).lean().then(data => !!data ? false : true).catch(() => false)) {
      await spigot.create({
        version: version.version,
        datePublish: version.Date,
        isLatest: false,
        spigotJar: version.url
      });
    }
  }
  const latestDatabase = await spigot.findOne({ version: data[0].version }).lean();
  latestDatabase.isLatest = true;
  await spigot.updateOne({ _id: latestDatabase._id }, latestDatabase);
  return {
    new: await spigot.findOne({ isLatest: true }).lean(),
    old: latestVersion
  }
}