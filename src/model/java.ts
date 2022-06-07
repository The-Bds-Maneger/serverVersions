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

// Local cache
let localCache: Array<javaSchema> = [];
export function getLocalCache() {
  return localCache;
}
export function enableLocalCache() {
  if (this.enabled) return;
  enableLocalCache.prototype.enabled = true;
  setInterval(() => java.find().lean().then((data) => (localCache = data)).catch(console.trace), 1000 * 60 * 10);
  java.find().lean().then((data) => (localCache = data)).catch(console.trace)
  return;
}
enableLocalCache.prototype.enabled = false;