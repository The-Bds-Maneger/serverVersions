import * as httpRequest from "../HTTP_Request";

export default async function java() {
  const HTML_ARRAY = (await httpRequest.RAW_TEXT("https://www.minecraft.net/en-us/download/server")).split(/["'<>]|\n|\t/gi).map(a => a.trim()).filter(a => a).filter(a => /\.jar/.test(a));
  const HttpRequests = await httpRequest.HTML_URLS("https://www.minecraft.net/en-us/download/server");
  
  const VersionObject = {
    Date: new Date(),
    Version: HTML_ARRAY.filter(a => /[0-9\.]\.jar/.test(a)).map(a => a.split(/[a-zA-Z\._]/gi).map(a => a.trim()).filter(a=>a).join("."))[0],
    data: HttpRequests.filter(ver => /http.*\.jar/.test(ver))[0]
  };

  // return new version
  return VersionObject;
}