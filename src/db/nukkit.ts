import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

export type nukkitSchema = {
  version: string,
  date: Date,
  url: string,
  latest: boolean
};

export const nukkit = connection.model<nukkitSchema>("nukkit", new mongoose.Schema<nukkitSchema>({
  version: {
    type: String,
    unique: false,
    required: true
  },
  date: Date,
  url: String,
  latest: Boolean
}));

app.get("/", ({res}) => nukkit.find().lean().then(data => res.json(data)));
app.get("/latest", ({res}) => nukkit.findOne({latest: true}).lean().then(data => res.json(data)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionDB = await nukkit.findOne({version}).lean();
  if (!versionDB) return res.status(404).json({error: "Version not found"});
  return res.json(versionDB);
});