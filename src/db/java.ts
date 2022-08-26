import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

// Type to represent the Java model
export type javaSchema = {
  version: string;
  datePublish: Date;
  isLatest: true | false;
  javaJar: string;
};

const java = connection.model<javaSchema>("java", new mongoose.Schema<javaSchema>({
  version: {
    type: String,
    required: true,
    unique: true,
  },
  datePublish: {
    type: Date,
    required: true,
  },
  isLatest: {
    type: Boolean,
    required: true,
  },
  javaJar: {
    type: String,
    required: true,
  },
}));
export default java;

app.get("/", async ({res}) => res.json(await java.find().lean()));
app.get("/latest", async ({res}) => res.json(await java.findOne({isLatest: true}).lean()));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await java.findOne({version: version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});