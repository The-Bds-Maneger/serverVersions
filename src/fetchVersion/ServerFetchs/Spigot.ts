const HTTP_Request = require("../HTTP_Request");
const { JSDOM } = require("jsdom");

async function FetchVersions() {
  const Versions = [];
  const Page = await HTTP_Request.RAW_TEXT("https://getbukkit.org/download/spigot");
  const { document } = new JSDOM(Page).window;
  const Doms = document.querySelectorAll("#download > div > div > div > div");
  Doms.forEach(DOM => {
    const New_Dom = {
      version: DOM.querySelector("div:nth-child(1) > h2").innerHTML,
      Date: DOM.querySelector("div:nth-child(3) > h3").innerHTML.trim(),
      url: DOM.querySelector("div:nth-child(4) > div:nth-child(2) > a").href,
    }
    Versions.push(New_Dom)
  });

  return Versions.map(Release => {
    const Data = {
      Date: new Date(Release.Date),
      Version: String(Release.version),
      data: String(Release.url)
    }
    Data.Version = Data.Version.replace(/[,]/gi, ".");
    return Data;
  });
}

if (require.main === module) FetchVersions().then(console.log).catch(console.error);
else module.exports.main = FetchVersions;
module.exports.platform = "spigot";
