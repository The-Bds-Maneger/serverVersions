import { Router } from "express";
import spigot from "../model/spigot";
const app = Router();
export default app;

app.get("/", async ({res}) => res.json(await spigot.find()));
app.get("/latest", async ({res}) => res.json(await spigot.findOne({isLatest: true}).lean()));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await spigot.findOne({version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});