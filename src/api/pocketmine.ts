import { Router } from "express";
import { GithubRelease } from "../fetchVersion/HTTP_Request";
import pocketminemmp from "../model/pocketmine";
const app = Router();
export default app;

app.get("/", async ({res}) => res.json(await pocketminemmp.find().lean()));
app.get("/latest", async ({res}) => res.json(await pocketminemmp.findOne({isLatest: true}).lean()));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await pocketminemmp.findOne({version: version}).lean();
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