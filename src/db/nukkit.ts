import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

// Type to represent the Java model
export type javaSchema = {
  version: string,
  datePublish: Date,
  isLatest: true | false,
  jar: string,
  variant: "nukkit"|"powernukkit"
};

export const nukkit = connection.model<javaSchema>("nukkit", new mongoose.Schema<javaSchema>({
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
  jar: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    required: false,
    default: "nukkit"
  }
}));
