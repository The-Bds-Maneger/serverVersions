import {getJson} from "../lib/HTTP_Request";
import {} from "../db/paper";

export default async function find() {
  const data = (await getJson("https://api.papermc.io/v2/projects/paper"))?.versions;
  for (const version of data) {
    const data2 = await getJson(`https://api.papermc.io/v2/projects/paper/versions/${version}`).then(data => Promise.all(data.builds.map(build => getJson(`https://api.papermc.io/v2/projects/paper/versions/${version}/builds/${build}`))).catch(()=>undefined));
    console.log(data2);
  }
}
find();
