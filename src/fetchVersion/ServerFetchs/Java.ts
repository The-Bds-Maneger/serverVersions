import * as httpRequest from "../HTTP_Request";
import { java } from "../../model/java";

async function Add(Version: string, versionDate: Date, url: string) {
  if (await java.findOne({ version: Version }).lean().then(data => !!data).catch(() => true)) console.log("Java: version (%s) already exists", Version);
  else {
    console.log("Java: Version %s, url %s", Version, url);
    await java.findOneAndUpdate({isLatest: true}, {$set: {isLatest: false}});
    await java.create({
      version: Version,
      datePublish: versionDate,
      isLatest: true,
      javaJar: url
    });
  }
}

async function Find() {
  const HTML_ARRAY = (await httpRequest.RAW_TEXT("https://minecraft.net/en-us/download/server")).split(/["'<>]|\n|\t/gi).map(a => a.trim()).filter(a => a).filter(a => /\.jar/.test(a));
  const HttpRequests = await httpRequest.HTML_URLS("https://minecraft.net/en-us/download/server");
  
  const VersionObject = {
    Date: new Date(),
    Version: HTML_ARRAY.filter(a => /[0-9\.]\.jar/.test(a)).map(a => a.split(/[a-zA-Z\._]/gi).map(a => a.trim()).filter(a=>a).join("."))[0],
    data: HttpRequests.filter(ver => /http.*\.jar/.test(ver))[0]
  };
  await Add(VersionObject.Version, VersionObject.Date, VersionObject.data);
  return VersionObject;
}

export default async function UpdateDatabase() {
  const latestVersion = await java.findOneAndUpdate({isLatest: true}, {$set: {isLatest: false}}).lean();
  return {
    new: await Find(),
    old: latestVersion
  };
}