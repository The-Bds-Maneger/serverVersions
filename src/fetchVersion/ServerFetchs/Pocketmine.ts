import * as httpRequest from "../HTTP_Request";
import { pocketminemmp } from "../../model/pocketmine";

async function Find(): Promise<Array<{Date: Date; Version: string; data: string;}>> {
  const version = await httpRequest.GithubRelease("pmmp/PocketMine-MP");
  const filterVersion = [];
  version.filter(Release => !/beta|alpha/gi.test(Release.tag_name.toLowerCase())).forEach(release => {
    const PharFile = release.assets.filter(asset => asset.name.endsWith(".phar"));
    if (PharFile.length > 0) {
      const Data = {
        Date: new Date(release.published_at),
        Version: release.tag_name,
        data: PharFile[0].browser_download_url
      }
      filterVersion.push(Data);
    };
    return
  });
  return filterVersion;
}

export default async function UpdateDatabase() {
  const data = await Find();
  const latestVersion = await pocketminemmp.findOne({ isLatest: true }).lean();
  latestVersion.isLatest = false;
  await pocketminemmp.updateOne({ _id: latestVersion._id }, latestVersion);
  for (const version of data) {
    if (await pocketminemmp.findOne({ version: version.Version }).lean().then(data => !!data ? false : true).catch(() => false)) {
      await pocketminemmp.create({
        version: version.Version,
        datePublish: version.Date,
        isLatest: false,
        pocketminePhar: version.data
      });
    }
  }
  const latestDatabase = await pocketminemmp.findOne({ version: data[0].Version }).lean();
  latestDatabase.isLatest = true;
  await pocketminemmp.updateOne({ _id: latestDatabase._id }, latestDatabase);
  return {
    new: await pocketminemmp.findOne({ isLatest: true }).lean(),
    old: latestVersion
  };
}