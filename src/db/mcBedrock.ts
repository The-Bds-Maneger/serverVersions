import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

export type bedrockSchema = {
  version: string,
  date: Date,
  variant: {
    to: "vanilla"|"pocketmine",
    latest: boolean
  },
  linux?: string,
  win32?: string,
  url?: string
};

export const bedrock = connection.model<bedrockSchema>("bedrock", new mongoose.Schema<bedrockSchema>({
  version: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    dafault: Date.now
  },
  variant: {
    to: {
      type: String,
      required: true,
      enum: ["vanilla", "pocketmine"]
    },
    latest: {
      type: Boolean,
      required: true
    }
  },
  url: String,
  linux: String,
  win32: String
}));
