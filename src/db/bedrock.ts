import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

// Type to represent the Bedrock model
export type bedrockSchema = {
  version: string;
  datePublish: Date;
  isLatest: true|false;
  win32: {
    x64: string;
    arm64?: string;
  };
  linux: {
    x64: string;
    arm64?: string;
  };
  darwin: {
    x64?: string;
    arm64?: string;
  };
};

// Mongoose Schema
// Bedrock database
const bedrock = connection.model<bedrockSchema>("bedrock", new mongoose.Schema<bedrockSchema>({
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
  win32: {
    x64: {
      type: String,
      required: true,
    },
    arm64: {
      type: String,
    },
  },
  linux: {
    x64: {
      type: String,
      required: true,
    },
    arm64: {
      type: String,
    },
  },
  darwin: {
    x64: {
      type: String,
    },
    arm64: {
      type: String,
    },
  },
}));
export default bedrock;

app.get("/", async ({res}) => res.json(await bedrock.find().lean()));
app.get("/latest", async ({res}) => res.json(await bedrock.findOne({isLatest: true}).lean()));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await bedrock.findOne({version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});