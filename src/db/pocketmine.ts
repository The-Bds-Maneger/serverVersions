import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
import { httpRequestGithub } from "@sirherobrine23/coreutils";
export const app = Router();

export type pocketminemmpSchema = {
  version: string,
  date: Date,
  latest: boolean,
  url: string
};

export const pocketmine = connection.model<pocketminemmpSchema>("pocketminemmp", new mongoose.Schema<pocketminemmpSchema>({
  version: {
    type: String,
    required: true,
    unique: true
  },
  date: Date,
  latest: Boolean,
  url: String
}));

app.get("/", ({res}) => pocketmine.find().lean().then(data => res.json(data)));
app.get("/latest", async ({res}) => res.json(await pocketmine.findOne({latest: true}).lean()));
app.get("/bin", async (req, res) => {
  let os = RegExp((req.query.os as string)||"(win32|windows|linux|macos|mac)");
  let arch = RegExp((req.query.arch as string)||".*");
  const redirect = req.query.redirect === "true";
  const rele = await httpRequestGithub.getRelease({
    owner: "The-Bds-Maneger",
    repository: "Build-PHP-Bins"
  });
  const Files = [];
  for (const release of rele) {
    for (const asset of release.assets) {
      if (os.test(asset.name) && arch.test(asset.name)) Files.push({
        url: asset.browser_download_url,
        name: asset.name
      });
    }
  }
  if (Files.length >= 1) {
    if (redirect) return res.redirect(Files[0].url);
    return res.json(Files);
  }
  return res.status(404).json({error: "No bin found"});
});
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await pocketmine.findOne({version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});
