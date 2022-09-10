import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

export type glowstoneSchema = {
  version: string,
  date: Date,
  latest: boolean,
  url: string
};

export const glowstone  = connection.model<glowstoneSchema>("glowerstone", new mongoose.Schema({
  version: {
    type: String,
    required: true,
    unique: true
  },
  date: Date,
  latest: Boolean,
  url: String
}));

app.get("/", ({res}) => glowstone.find().lean().then(data => res.json(data)));
app.get("/latest", ({res}) => glowstone.findOne({latest: true}).lean().then(data => res.json(data)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionDB = await glowstone.findOne({version}).lean();
  if (!versionDB) return res.status(404).json({error: "Version not found"});
  return res.json(versionDB);
});