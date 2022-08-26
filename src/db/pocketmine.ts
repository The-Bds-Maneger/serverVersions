import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
import { GithubRelease } from "../fetchVersion/HTTP_Request";
export const app = Router();


// Type to represent the pocketminemp model
export type pocketminemmpSchema = {
  version: string;
  datePublish: Date;
  isLatest: true|false;
  pocketminePhar: string;
};

const pocketmine = connection.model<pocketminemmpSchema>("pocketminemmp", new mongoose.Schema<pocketminemmpSchema>({
  version: {
    type: String,
    required: true,
    unique: true
  },
  datePublish: {
    type: Date,
    required: true
  },
  isLatest: {
    type: Boolean,
    required: true
  },
  pocketminePhar: {
    type: String,
    required: true
  }
}));
export default pocketmine;

app.get("/", async ({res}) => res.json((await pocketmine.find().lean()).sort((a, b) => a.datePublish.getTime() - b.datePublish.getTime()).reverse()));
app.get("/latest", async ({res}) => res.json(await pocketmine.findOne({isLatest: true}).lean()));
app.get("/bin", async (req, res) => {
  let os = RegExp((req.query.os as string)||"(win32|windows|linux|macos|mac)");
  let arch = RegExp((req.query.arch as string)||".*");
  const redirect = req.query.redirect === "true";
  const rele = await GithubRelease("The-Bds-Maneger/Build-PHP-Bins");
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