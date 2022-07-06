import mongoose from "mongoose";
import { connection } from "../connect";

// Type to represent the Java model
export type javaSchema = {
  version: string;
  datePublish: Date;
  isLatest: true | false;
  javaJar: string;
};

export const Schema = new mongoose.Schema<javaSchema>({
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
});

export const java = connection.model<javaSchema>("java", Schema);
export default java;