import {getJson} from "../lib/HTTP_Request";
import { paper } from "../db/paper";
import logging from "../lib/logging";

export default async function find() {
  const data = (await getJson("https://api.papermc.io/v2/projects/paper"))?.versions;
  for (const version of data) {
    const data2 = await getJson(`https://api.papermc.io/v2/projects/paper/versions/${version}/builds`);
    for (const build of data2.builds) {
      const fileDate = new Date(build.time),
      downloadUrl = `https://api.papermc.io/v2/projects/paper/versions/${data2.version}/builds/${build.build}/downloads/${build.downloads.application.name}`;
      if (await paper.findOne({url: downloadUrl}).lean()) {
        logging("alter", `Droping version: ${data2.version} - build: ${build.build}`);
        continue
      }
      await paper.create({
        version: data2.version,
        build: build.build,
        date: fileDate,
        url: downloadUrl,
        latest: false
      });
    }
  }
  await paper.findOneAndUpdate({latest: true}, {$set: {latest: false}}).lean();
  const latestVersionByDate = (await paper.find().lean()).sort((a, b) => b.date.getTime()-a.date.getTime())[0];
  await paper.findByIdAndUpdate(latestVersionByDate._id, {$set: {latest: true}}).lean();
}