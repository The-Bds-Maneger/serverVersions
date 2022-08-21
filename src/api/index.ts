import https from "https";
import http from "http";
import express from "express";
import cors from "cors";
import yaml from "yaml";
import * as connection from "../connect";
import * as bedrock from "../model/bedrock";
import * as java from "../model/java";
import * as pocketminemmp from "../model/pocketmine";
import * as spigot from "../model/spigot";
import bedrockExpress from "./bedrock";
import javaExpress from "./java";
import pocketmineExpress from "./pocketmine";
import spigotExpress from "./spigot";

const app = express();
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
app.disable("x-powered-by");
app.disable("etag");

// Print user request api
app.use((req, res, next) => {
  console.log("(%s %s): %s", req.protocol, req.ip, req.originalUrl);
  return next();
});

// Global version
app.get("/", async ({res}) => {
  try {
    const [ bedrockVersions, javaVersions, pocketmineVersions, spigotVersions ] = await Promise.all([ bedrock.bedrock.find().lean(), java.java.find().lean(), pocketminemmp.pocketminemmp.find().lean(), spigot.spigot.find().lean() ]);
    return res.json({
      latest: {
        bedrock: bedrockVersions?.find(({isLatest}) => isLatest)?.version,
        java: javaVersions?.find(({isLatest}) => isLatest)?.version,
        pocketmine: pocketmineVersions?.find(({isLatest}) => isLatest)?.version,
        spigot: spigotVersions?.find(({isLatest}) => isLatest)?.version
      },
      versions: {
        bedrock: bedrockVersions,
        java: javaVersions,
        pocketmine: pocketmineVersions,
        spigot: spigotVersions
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: String(err)
    });
  }
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

// Listen server
connection.connection.once("connected", () => {
  // Listen ports
  const portsListen = {http: process.env.PORT || 8080, https: process.env.PORTS || 8443};
  if (process.env.KEY && process.env.CERT) https.createServer({key: process.env.KEY, cert: process.env.CERT}, app).listen(portsListen.https, () => console.log("(HTTPS) Listening on port %o", portsListen.https));
  else console.log("(HTTPS) No certificate found, not listening on port %o, listen on port %o instead", portsListen.https, portsListen.http);
  http.createServer(app).listen(portsListen.http, () => console.log("(HTTP) Listening on port %o", portsListen.http));
});
