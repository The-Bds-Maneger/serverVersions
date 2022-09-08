import mongoose from "mongoose";
import connection from "./connect";
import { Router } from "express";
export const app = Router();

export type nukkitSchema = {
  version: string,
  date: Date,
  url: string,
  variant: {
    to: "powernukkit"|"nukkit",
    latest: boolean
  }
};

export const nukkit = connection.model<nukkitSchema>("nukkit", new mongoose.Schema<nukkitSchema>({
  version: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  variant: {
    latest: {
      type: Boolean,
      required: true
    },
    to: {
      type: String,
      required: false,
      default: "nukkit",
      enum: ["nukkit", "powernukkit"]
    }
  }
}));
