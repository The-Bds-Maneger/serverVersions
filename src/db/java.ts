import mongoose from "mongoose";
import connection from "./connect.js";
import { Router } from "express";
import semver from "semver";
export const app = Router();

export type javaSchema = {
  version: string,
  date: Date,
  latest: boolean,
  url: string
};

export const java = connection.model<javaSchema>("java", new mongoose.Schema<javaSchema>({
  version: {
    type: String,
    required: true,
    unique: true
  },
  date: Date,
  latest: Boolean,
  url: String
}));
export default java;
export const getAll = async () => (await java.find().lean()).sort((b, a) => semver.compare(semver.valid(semver.coerce(a.version)), semver.valid(semver.coerce(b.version))));

app.get("/", ({res}) => getAll().then(data => res.json(data)));
app.get("/latest", async ({res}) => res.json((await getAll()).at(0)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await java.findOne({version: version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});
