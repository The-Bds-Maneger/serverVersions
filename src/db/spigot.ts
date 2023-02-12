import { Router } from "express";
import connection from "./connect.js";
import mongoose from "mongoose";
import semver from "semver";
export const app = Router();

// Type to represent the spigot model
export type spigotSchema = {
  version: string,
  date: Date,
  latest: boolean,
  url: string
};

export const spigot = connection.model<spigotSchema>("spigot", new mongoose.Schema<spigotSchema>({
  version: {
    type: String,
    required: true,
    unique: true
  },
  date: Date,
  latest: Boolean,
  url: String
}));
export const getAll = () => spigot.find().lean().then(data => data.sort((b, a) => semver.compare(semver.valid(semver.coerce(a.version)), semver.valid(semver.coerce(b.version)))));

app.get("/", ({res}) => getAll().then(data => res.json(data)));
app.get("/latest", async ({res}) => res.json((await getAll()).at(0)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await spigot.findOne({version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});
