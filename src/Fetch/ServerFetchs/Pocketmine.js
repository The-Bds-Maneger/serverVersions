const HTTP_Request = require("../HTTP_Request");

async function MainFetch() {
  const version = await HTTP_Request.GithubRelease("pmmp/PocketMine-MP");
  return version.filter(Release => !/beta|alpha/gi.test(Release.tag_name.toLowerCase())).map(release => {
    const PharFile = release.assets.filter(asset => asset.name.endsWith(".phar"));
    if (PharFile.length > 0) {
      const Data = {
        Date: new Date(release.published_at),
        Version: release.tag_name,
        data: {
          url: PharFile[0].browser_download_url
        }
      }
      return Data;
    } else return false;
  }).filter(a=>a);
}

if (require.main === module) MainFetch().then(console.log).catch(console.error);
else module.exports.main = MainFetch;
module.exports.platform = "pocketmine";