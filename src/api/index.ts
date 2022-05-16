import https from "https";
import http from "http";
import express from "express";
import cors from "cors";
import yaml from "yaml";
import bedrock from "../model/bedrock";
import bedrockExpress from "./bedrock";
import java from "../model/java";
import javaExpress from "./java";
import pocketminemmp from "../model/pocketmine";
import pocketmineExpress from "./pocketmine";
import spigot from "../model/spigot";
import spigotExpress from "./spigot";
const app = express();
// Listen
http.createServer(app).listen(8080, () => console.log("(HTTP) Listening on port 8080"));
if (process.env.KEY && process.env.CERT) https.createServer({key: process.env.KEY, cert: process.env.CERT}, app).listen(8443, () => console.log("(HTTPS) Listening on port 8443"));
console.log("(HTTPS) No certificate found, not listening on port 8443, listen on port 80 instead");

function NormaliseJson(objRec, keyToDel: Array<string>) {
  return JSON.parse(JSON.stringify(objRec, (key, value) => {
    if (keyToDel.includes(key)) return undefined;
    else if (typeof value === "string") return value.replace(/\r\n/g, "\n");
    return value;
  }));
}

app.use(cors());
app.use((req, res, next) => {
  res.json = (body) => {
    body = NormaliseJson(body, ["__v", "_id"]);
    if (req.query.type === "yaml"||req.query.type === "yml") {
      res.setHeader("Content-Type", "text/yaml");
      res.send(yaml.stringify(body));
      return res;
    }
    res.set("Content-Type", "application/json");
    res.send(JSON.stringify(body, (_, value) => {
      if (typeof value === "bigint") return value.toString();
      return value;
    }, 2));
    return res;
  }
  return next();
});

// Global version
app.get("/", async ({res}) => {
  const bedrockVersions = await bedrock.find().lean();
  const javaVersions = await java.find().lean();
  const pocketmineVersions = await pocketminemmp.find().lean();
  const spigotVersions = await spigot.find().lean();
  return res.json({
    latest: {
      bedrock: bedrockVersions.find(({isLatest}) => isLatest).version,
      java: javaVersions.find(({isLatest}) => isLatest).version,
      pocketmine: pocketmineVersions.find(({isLatest}) => isLatest)?.version,
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
app.use("/bedrock", bedrockExpress);
//Java
app.use("/java", javaExpress);
//Pocketmine
app.use("/pocketmine", pocketmineExpress);
//Spigot
app.use("/spigot", spigotExpress);
//Return 404 for all other routes
app.all("*", ({res}) => res.status(404).json({error: "Not found"}));
