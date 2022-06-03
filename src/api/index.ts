import https from "https";
import http from "http";
import express from "express";
import cors from "cors";
import yaml from "yaml";
import bedrock, { bedrockSchema } from "../model/bedrock";
import bedrockExpress from "./bedrock";
import java, { javaSchema } from "../model/java";
import javaExpress from "./java";
import pocketminemmp, { pocketminemmpSchema } from "../model/pocketmine";
import pocketmineExpress from "./pocketmine";
import spigot, { spigotSchema } from "../model/spigot";
import spigotExpress from "./spigot";

const app = express();
// Listen ports
const portsListen = {http: process.env.PORT || 8080, https: process.env.PORTS || 8443};
if (process.env.KEY && process.env.CERT) https.createServer({key: process.env.KEY, cert: process.env.CERT}, app).listen(portsListen.https, () => console.log("(HTTPS) Listening on port %o", portsListen.https));
else console.log("(HTTPS) No certificate found, not listening on port %o, listen on port %o instead", portsListen.https, portsListen.http);
http.createServer(app).listen(portsListen.http, () => console.log("(HTTP) Listening on port %o", portsListen.http));

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
/* const ipIs: {
  [path: string]: {
    [method: string]: {
      [ip: string]: {
        request: number
      }
    }
  }
} = {};
app.use((req, res, next) => {
  console.log("(%s %s): %s", req.protocol, req.ip, req.originalUrl);
  if (/^\/stat/.test(req.originalUrl)) {
    res.json(ipIs);
    return;
  }
  if (!ipIs[req.originalUrl]) ipIs[req.originalUrl] = {};
  if (!ipIs[req.originalUrl][req.method]) ipIs[req.originalUrl][req.method] = {};
  if (!ipIs[req.originalUrl][req.method][req.ip]) ipIs[req.originalUrl][req.method][req.ip] = {request: 0};
  ipIs[req.originalUrl][req.method][req.ip].request++;
  return next();
}); */

// Global version
let cacheBedrock: Array<bedrockSchema> = [];
let cacheJava: Array<javaSchema> = [];
let cachePocketmine: Array<pocketminemmpSchema> = [];
let cacheSpigot: Array<spigotSchema> = [];
bedrock.find().lean().then(data => cacheBedrock = data);
java.find().lean().then(data => cacheJava = data);
pocketminemmp.find().lean().then(data => cachePocketmine = data);
spigot.find().lean().then(data => cacheSpigot = data);
setInterval(() => {
  bedrock.find().lean().then(data => cacheBedrock = data);
  java.find().lean().then(data => cacheJava = data);
  pocketminemmp.find().lean().then(data => cachePocketmine = data);
  spigot.find().lean().then(data => cacheSpigot = data);
}, 1000 * 60 * 3);
app.get("/", async ({res}) => {
  const [ bedrockVersions, javaVersions, pocketmineVersions, spigotVersions ] = [ cacheBedrock, cacheJava, cachePocketmine, cacheSpigot ];
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
