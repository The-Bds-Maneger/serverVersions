import { Router } from "express";
import bedrock, { bedrockSchema } from "../model/bedrock";
const app = Router();
export default app;

let bedrockCache: Array<bedrockSchema> = [];
console.log("Updating bedrock cache");
bedrock.find().lean().then(data => bedrockCache = data);
setInterval(() => {console.log("Updating bedrock cache");bedrock.find().lean().then(data => bedrockCache = data);}, 1000 * 60 * 3);

app.get("/", async ({res}) => res.json(bedrockCache));
app.get("/latest", async ({res}) => res.json(bedrockCache.find(res => res.isLatest)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = bedrockCache.find(res => res.version === version);
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});