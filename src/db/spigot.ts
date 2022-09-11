import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
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

app.get("/", async ({res}) => res.json((await spigot.find()).sort((a, b) => a.date.getTime() - b.date.getTime()).reverse()));
app.get("/latest", async ({res}) => res.json(await spigot.findOne({latest: true}).lean()));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await spigot.findOne({version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});