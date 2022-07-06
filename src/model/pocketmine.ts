import mongoose from "mongoose";
import { connection } from "../connect";

// Type to represent the pocketminemp model
export type pocketminemmpSchema = {
  version: string;
  datePublish: Date;
  isLatest: true|false;
  pocketminePhar: string;
};

export const Schema = new mongoose.Schema<pocketminemmpSchema>({
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
  pocketminePhar: {
    type: String,
    required: true
  }
});

export const pocketminemmp = connection.model<pocketminemmpSchema>("pocketminemmp", Schema);
export default pocketminemmp;