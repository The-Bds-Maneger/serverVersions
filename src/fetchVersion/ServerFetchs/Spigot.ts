import jsdom from "jsdom";
import * as httpRequest from "../HTTP_Request";

export default async function spigot(): Promise<Array<{version: string; Date: Date; url: string;}>> {
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
// .then(async data => {
//   for (const version of data) {
//     if (await spigot.findOne({ version: version.version }).then(err => err === undefined ? false : true).catch(() => true)) console.log("Spigot: version (%s) already exist", version.version);
//     else {
//       await spigot.create({
//         version: version.version,
//         datePublish: version.Date,
//         spigotJar: version.url,
//         isLatest: version.version === data[0].version
//       });
//     }
//   }
// });