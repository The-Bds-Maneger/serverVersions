const HTTP_Request = require("../HTTP_Request");

async function MainRequest() {
  const HTML_ARRAY = (await HTTP_Request.RAW_TEXT("https://www.minecraft.net/en-us/download/server")).split(/["'<>]|\n|\t/gi).map(a => a.trim()).filter(a => a).filter(a => /\.jar/.test(a));
  const HttpRequests = await HTTP_Request.HTML_URLS("https://www.minecraft.net/en-us/download/server");
  
  const VersionObject = {
    Date: new Date(),
    Version: HTML_ARRAY.filter(a => /[0-9\.]\.jar/.test(a)).map(a => a.split(/[a-zA-Z\._]/gi).map(a => a.trim()).filter(a=>a).join("."))[0],
    data: {
      url: HttpRequests.filter(ver => /http.*\.jar/.test(ver))[0]
    }
  };

  // return new version
  return VersionObject;
}

if (require.main === module) MainRequest().then(console.log).catch(console.error);
else module.exports.main = MainRequest;
module.exports.platform = "java";