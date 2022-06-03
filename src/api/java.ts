import { Router } from "express";
import java, { javaSchema } from "../model/java";
const app = Router();
export default app;

let javaCache: Array<javaSchema> = [];
console.log("Updating java cache");
java.find().lean().then(data => javaCache = data);
setInterval(() => {console.log("Updating java cache");java.find().lean().then(data => javaCache = data);}, 1000 * 60 * 3);

app.get("/", async ({res}) => res.json(javaCache));
app.get("/latest", async ({res}) => res.json(javaCache.find(res => res.isLatest)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = javaCache.find(res => res.version === version);
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});