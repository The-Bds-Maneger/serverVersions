import { Router } from "express";
import spigot, { spigotSchema } from "../model/spigot";
const app = Router();
export default app;

let spigotCache: Array<spigotSchema> = [];
console.log("Updating spigot cache");
spigot.find().lean().then(data => spigotCache = data);
setInterval(() => {console.log("Updating spigot cache");spigot.find().lean().then(data => spigotCache = data);}, 1000 * 60 * 3);

app.get("/", async ({res}) => res.json(spigotCache));
app.get("/latest", async ({res}) => res.json(spigotCache.find(res => res.isLatest)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = spigotCache.find(res => res.version === version);
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});