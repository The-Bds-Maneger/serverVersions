import log from "../logging";
import * as httpRequest from "../HTTP_Request";
import { pocketminemmp } from "../../model/pocketmine";

async function Add(Version: string, versionDate: Date, url: string) {
  if (await pocketminemmp.findOne({ version: Version }).lean().then(data => !!data).catch(() => true)) log("alter", "Pocketmine: version (%s) already exists", Version);
  else {
    log("alter", "Pocketmine PMMP: Version %s, url %s", Version, url);
    await pocketminemmp.create({
      version: Version,
      datePublish: versionDate,
      isLatest: false,
      pocketmineJar: url
    });
  }
}

async function Find() {
  const Publish: Array<{Publish: () => Promise<void>, Data: {Date: Date, Version: string, url: string}}> = (await httpRequest.GithubRelease("pmmp/PocketMine-MP")).filter(Release => !/beta|alpha/gi.test(Release.tag_name.toLowerCase())).map(Release => {
    Release.assets = Release.assets.filter(asset => asset.name.endsWith(".phar"));
    return Release;
  }).filter(a => a.assets.length > 0).map(release => {
    return {
      Publish: async () => await Add(release.tag_name, new Date(release.published_at), release.assets[0].browser_download_url),
      Data: {
        Date: new Date(release.published_at),
        Version: release.tag_name,
        url: release.assets[0].browser_download_url
      }
    };
  });
  await Promise.all(Publish.map(a => a.Publish()));
  return Publish;
}

export default async function UpdateDatabase() {
  const latestVersion = await pocketminemmp.findOneAndUpdate({ isLatest: true }, {$set: {isLatest: false}}).lean();
  const Releases = (await Find()).map(a => a.Data);
  const newLatest = await pocketminemmp.findOneAndUpdate({ version: Releases[0].Version }, {$set: { isLatest: true }}).lean();
  return {
    new: newLatest,
    old: latestVersion
  };
}
