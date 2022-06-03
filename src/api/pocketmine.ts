import { Router } from "express";
import { GithubRelease } from "../fetchVersion/HTTP_Request";
import pocketminemmp, { pocketminemmpSchema } from "../model/pocketmine";
const app = Router();
export default app;

let pocketminemmpCache: Array<pocketminemmpSchema> = [];
console.log("Updating pocketminemmp cache");
pocketminemmp.find().lean().then(data => pocketminemmpCache = data);
setInterval(() => {console.log("Updating pocketminemmp cache");pocketminemmp.find().lean().then(data => pocketminemmpCache = data);}, 1000 * 60 * 3);

app.get("/", async ({res}) => res.json(pocketminemmpCache));
app.get("/latest", async ({res}) => res.json(pocketminemmpCache.find(res => res.isLatest)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = pocketminemmpCache.find(res => res.version === version);
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});
app.get("/search/bin", async (req, res) => {
  const os = req.query.os as string;
  if (!os) return res.status(400).json({error: "No os specified"});
  const arch = req.query.arch as string;
  if (!arch) return res.status(400).json({error: "No System arch specified"});
  const rele = await GithubRelease("The-Bds-Maneger/Build-PHP-Bins");
  for (const release of rele) {
    for (const asset of release.assets) {
      if (asset.name.includes(os) && asset.name.includes(arch)) {
        if (req.query.redirect === "true") return res.redirect(asset.browser_download_url);
        return res.json({
          url: asset.browser_download_url,
          name: asset.name
        });
      }
    }
  }
  return res.status(404).json({error: "No bin found"});
});