import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

// Type to represent the spigot model
export type spigotSchema = {
  version: string;
  datePublish: Date;
  isLatest: true|false;
  spigotJar: string;
};

const spigot = connection.model<spigotSchema>("spigot", new mongoose.Schema<spigotSchema>({
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
  spigotJar: {
    type: String,
    required: true
  }
}));
export default spigot;

app.get("/", async ({res}) => res.json(await spigot.find()));
app.get("/latest", async ({res}) => res.json(await spigot.findOne({isLatest: true}).lean()));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await spigot.findOne({version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});