import * as httpRequest from "@sirherobrine23/http";
import { paper } from "../db/paper.js";

type paperVersions = {
  project_id: string,
  project_name: string,
  version_groups: string[],
  versions: string[]
};

type paperBuilds = {
  project_id: string,
  project_name: string,
  version: string,
  builds: {
    build: number;
    time: string;
    channel: string;
    promoted: boolean;
    changes: {commit:  string, summary: string, message: string}[];
    downloads: {
      application: {name: string, sha256: string},
      mojangMappings: {name: string, sha256: string}
    }
  }[]
};

export default async function find() {
  const versions = (await httpRequest.jsonRequest<paperVersions>("https://api.papermc.io/v2/projects/paper")).body.versions;
  for (const version of versions) {
    const builds = (await httpRequest.jsonRequest<paperBuilds>(`https://api.papermc.io/v2/projects/paper/versions/${version}/builds`)).body;
    await Promise.all(builds.builds.map(async function(build){
      const downloadUrl = `https://api.papermc.io/v2/projects/paper/versions/${builds.version}/builds/${build.build}/downloads/${build.downloads.application.name}`;
      if (await paper.findOne({url: downloadUrl}).lean()) return;
      await paper.create({
        version: builds.version,
        build: build.build,
        date: new Date(build.time),
        url: downloadUrl,
        latest: false
      });
      return;
    }));
  }
  await paper.findOneAndUpdate({latest: true}, {$set: {latest: false}}).lean();
  const latestVersionByDate = await paper.findOne({version: versions.at(-1)}).lean();
  await paper.findByIdAndUpdate(latestVersionByDate._id, {$set: {latest: true}}).lean();
}