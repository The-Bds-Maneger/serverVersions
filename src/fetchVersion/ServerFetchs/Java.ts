import * as httpRequest from "../HTTP_Request";
import { java } from "../../model/java";

async function Find() {
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

export default async function UpdateDatabase() {
  const data = await Find();
  const latestVersion = await java.findOne({ isLatest: true }).lean();
  if (await java.findOne({ version: data.Version }).lean().then(data => !!data ? false : true).catch(() => false)) {
    if (data.Version !== latestVersion.version) {
      latestVersion.isLatest = false;
      await java.updateOne({ _id: latestVersion._id }, latestVersion);
    }
    await java.create({
      version: data.Version,
      datePublish: data.Date,
      isLatest: data.Version !== latestVersion.version,
      javaJar: data.data
    });
  }
  return {
    new: await java.findOne({ isLatest: true }).lean(),
    old: latestVersion
  };
}