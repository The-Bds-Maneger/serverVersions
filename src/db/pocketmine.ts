import { oracleBucket } from "@sirherobrine23/cloud";
import mongoose from "mongoose";
import connection from "./connect.js";
import { Router } from "express";
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

const bucket = await oracleBucket({
  region: "sa-saopaulo-1",
  namespace: "grwodtg32n4d",
  name: "bdsFiles",
  auth: {
    type: "preAuthentication",
    PreAuthenticatedKey: "0IKM-5KFpAF8PuWoVe86QFsF4sipU2rXfojpaOMEdf4QgFQLcLlDWgMSPHWmjf5W"
  }
});

app.get("/", ({res}) => pocketmine.find().lean().then(data => res.json(data)));
app.get("/latest", async ({res}) => res.json(await pocketmine.findOne({latest: true}).lean() ?? await pocketmine.findOne().sort({version: -1}).lean()));
app.get("/bin", async (req, res) => {
  let os = RegExp((req.query.os as string)||"(win32|windows|linux|macos|mac)");
  let arch = RegExp((req.query.arch as string)||".*");
  const files = (await bucket.listFiles() as any[]).filter(({name}) => name.startsWith("/php_bin/"));
  const osFiles = files.filter(({name}) => os.test(name));
  const archFiles = osFiles.filter(({name}) => arch.test(name));
  const latest = archFiles.sort((a, b) => b.name.localeCompare(a.name))[0];
  if (!latest) return res.status(404).json({error: "No files found"});
  return bucket.getFileStream(latest.name).then(stream => stream.pipe(res));
});
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await pocketmine.findOne({version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});
