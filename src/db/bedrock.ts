import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

export type bedrockSchema = {
  version: string,
  date: Date,
  latest: boolean,
  win32: string,
  linux: string
};

export const bedrock = connection.model<bedrockSchema>("bedrock", new mongoose.Schema<bedrockSchema>({
  version: {
    type: String,
    required: true,
    unique: true
  },
  date: Date,
  latest: Boolean,
  win32: String,
  linux: String
}));

app.get("/", async ({res}) => res.json((await bedrock.find().lean()).sort((a, b) => a?.date?.getTime() - b?.date?.getTime()).reverse()));
app.get("/latest", async ({res}) => res.json(await bedrock.findOne({latest: true}).lean()));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await bedrock.findOne({version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});
