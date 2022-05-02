import https from "https";
import http from "http";
import express from "express";
import cors from "cors";
import bedrock from "../model/bedrock";
import java from "../model/java";
import pocketminemmp from "../model/pocketmine";
import spigot from "../model/spigot";
import { GithubRelease } from "../fetchVersion/HTTP_Request";

const app = express();
// Listen
http.createServer(app).listen(8080, () => console.log("(HTTP) Listening on port 8080"));
if (process.env.KEY && process.env.CERT) https.createServer({key: process.env.KEY, cert: process.env.CERT}, app).listen(8443, () => console.log("(HTTPS) Listening on port 8443"));
console.log("(HTTPS) No certificate found, not listening on port 8443, listen on port 80 instead");

app.use(cors());
app.use(({res, next}) => {
  res.json = (body) => {
    res.set("Content-Type", "application/json");
    res.send(JSON.stringify(body, (key, value) => {
      if (key === "__v") return undefined;
      else if (key === "_id") return undefined;
      else if (key === "isLatest") return undefined;
      if (typeof value === "bigint") value = value.toString();
      return value;
    }, 2));
    return res;
  }
  return next();
});
app.get("/", async ({res}) => {
  const bedrockVersions = await bedrock.find().lean();
  const javaVersions = await java.find().lean();
  const pocketmineVersions = await pocketminemmp.find().lean();
  const spigotVersions = await spigot.find().lean();
  return res.json({
    latest: {
      bedrock: bedrockVersions.find(({isLatest}) => isLatest).version,
      java: javaVersions.find(({isLatest}) => isLatest).version,
      pocketmine: pocketmineVersions.find(({isLatest}) => isLatest).version,
      spigot: spigotVersions.find(({isLatest}) => isLatest).version
    },
    versions: {
      bedrock: bedrockVersions,
      java: javaVersions,
      pocketmine: pocketmineVersions,
      spigot: spigotVersions
    }
  });
});

// Bedrock
app.get("/bedrock", async ({res}) => res.json(await bedrock.find().lean()));
app.get("/bedrock/latest", async ({res}) => res.json(await bedrock.find({isLatest: true}).lean()));
app.get("/bedrock/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  return res.json(await bedrock.find({version: version}).lean());
});

// Java
app.get("/java", async ({res}) => res.json(await java.find().lean()));
app.get("/java/latest", async ({res}) => res.json(await java.find({isLatest: true}).lean()));
app.get("/java/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  return res.json(await java.find({version: version}).lean());
});

// Pocketmine
app.get("/pocketmine", async ({res}) => res.json(await pocketminemmp.find().lean()));
app.get("/pocketmine/latest", async ({res}) => res.json(await pocketminemmp.find({isLatest: true}).lean()));
app.get("/pocketmine/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  return res.json(await pocketminemmp.find({version: version}).lean());
});
app.get("/pocketmine/search/bin", async (req, res) => {
  const os = req.query.os as string;
  if (!os) return res.status(400).json({error: "No os specified"});
  const arch = req.query.arch as string;
  if (!arch) return res.status(400).json({error: "No System arch specified"});
  const rele = await GithubRelease("The-Bds-Maneger/Build-PHP-Bins");
  for (const release of rele) {
    for (const asset of release.assets) {
      if (asset.name.includes(os) && asset.name.includes(arch)) {
        if (req.query.redirect === "true") return res.redirect(asset.browser_download_url);
        return res.json({
          url: asset.browser_download_url,
          name: asset.name
        });
      }
    }
  }
  return res.status(404).json({error: "No bin found"});
});

// Spigot
app.get("/spigot", async ({res}) => res.json(await spigot.find().lean()));
app.get("/spigot/latest", async ({res}) => res.json(await spigot.find({isLatest: true}).lean()));
app.get("/spigot/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  return res.json(await spigot.find({version: version}).lean());
});

// Return 404 for all other routes
app.all("*", ({res}) => res.status(404).json({error: "Not found"}));