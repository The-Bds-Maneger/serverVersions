import * as httpRequest from "@sirherobrine23/http";
import { Router } from "express";
import semver from "semver";
export const app = Router();

export type bedrockSchema = {
  version: string,
  date: Date,
  release?: string,
  url: {
    [platform in NodeJS.Platform]?: {
      [arch in NodeJS.Architecture]?: string
    }
  }
};

export async function getAll() {
  return httpRequest.jsonRequest<bedrockSchema[]>("https://sirherobrine23.github.io/BedrockFetch/all.json").then(r => r.body.sort((a, b) => {
    return semver.compare(semver.valid(semver.coerce(a.version)), semver.valid(semver.coerce(b.version)));
  }));
}

app.get("/", ({res}) => getAll().then(data => res.json(data)));
app.get("/latest", async (req, res) => res.json((await getAll()).filter(rel => (req.query.beta?(rel.release === "preview"):true)).at(-1)));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = (await getAll()).find(rel => (rel.version === version) && (req.query.beta?(rel.release === "preview"):true));
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});
