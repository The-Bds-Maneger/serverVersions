import { Router } from "express";
import { getLocalCache } from "../model/spigot";
const app = Router();
export default app;

app.get("/", async ({res}) => res.json(getLocalCache()));
app.get("/latest", async ({res}) => res.json(getLocalCache().find(res => res.isLatest)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = getLocalCache().find(res => res.version === version);
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});