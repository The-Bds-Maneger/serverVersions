import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

// Type to represent the Java model
export type javaSchema = {
  version: string,
  date: Date,
  jar: string,
  variant: {
    to: "vanilla"|"spigot"|"paper"|"fabric",
    latest: boolean
  }
};

export const java = connection.model<javaSchema>("java", new mongoose.Schema<javaSchema>({
  version: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  jar: {
    type: String,
    required: true
  },
  variant: {
    to: {
      type: String,
      required: true,
      enum: ["vanilla", "spigot", "paper", "fabric"]
    },
    latest: Boolean
  }
}));
