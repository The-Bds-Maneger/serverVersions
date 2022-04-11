import mongoose from "mongoose";
import { connection } from "../connect";

// Type to represent the spigot model
export type spigotSchema = {
  version: string;
  datePublish: Date;
  isLatest: true|false;
  spigotJar: string;
};

export const Schema = new mongoose.Schema<spigotSchema>({
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
});

export const spigot = connection.model<spigotSchema>("spigot", Schema);
export default spigot;