import * as httpRequest from "../HTTP_Request";

export default async function pocketmine(): Promise<Array<{Date: Date; Version: string; data: string;}>> {
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