import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

export type paperSchema = {
  version: string,
  date: Date,
  latest: boolean,
  url: string
};

export const paper = connection.model<paperSchema>("paper", new mongoose.Schema<paperSchema>({
  version: {
    type: String,
    required: true,
    unique: true
  },
  date: Date,
  latest: Boolean,
  url: String
}));

app.get("/", ({res}) => paper.find().lean().then(data => res.json(data)));
app.get("/latest", ({res}) => paper.findOne({latest: true}).lean().then(data => res.json(data)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionDB = await paper.findOne({version}).lean();
  if (!versionDB) return res.status(404).json({error: "Version not found"});
  return res.json(versionDB);
});