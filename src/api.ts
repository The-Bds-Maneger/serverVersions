import https from "node:https";
import http from "node:http";
import yaml from "yaml";
import express from "express";
import cors from "cors";

// Db And routes
import dbConnect from "./db/connect";
import bedrock, {app as bedrockExpress} from "./db/bedrock";
import java, {app as javaExpress} from "./db/java";
import pocketminemmp, {app as pocketmineExpress} from "./db/pocketmine";
import spigot, {app as spigotExpress} from "./db/spigot";

const app = express();
app.disable("x-powered-by");
app.disable("etag");
app.use(cors());
app.use((req, res, next) => {
  res.json = (body) => {
    const deleteKeys = ["__v", "_id"];
    body = JSON.parse(JSON.stringify(body, (key, value)=>deleteKeys.includes(key)?undefined:value));
    if (req.query.type === "yaml"||req.query.type === "yml") return res.setHeader("Content-Type", "text/yaml").send(yaml.stringify(body));
    return res.set("Content-Type", "application/json").send(JSON.stringify(body, (_, value) => typeof value === "bigint" ? value.toString():value, 2));
  }
  return next();
});

// Ping
app.all("/ping", ({res}) => res.status(200).json({status: "Ok", from: process.env.RUNNINGON||"unknown"}));

// Listen server
dbConnect.once("connected", () => {
  // Listen ports
  const portsListen = {http: process.env.PORT || 8080, https: process.env.PORTS || 8443};
  http.createServer(app).listen(portsListen.http, () => console.log("(HTTP) Listening on port %o", portsListen.http));
  if (process.env.KEY && process.env.CERT) https.createServer({key: process.env.KEY, cert: process.env.CERT}, app).listen(portsListen.https, () => console.log("(HTTPS) Listening on port %o", portsListen.https));
});

// Print user request api
app.use((req, _res, next) => {
  next();
  console.log("(%s %s): %s", req.protocol, req.ip, req.originalUrl);
});

// Global version
app.get("/", (req, res) => Promise.all([bedrock.findOne({isLatest: true}).lean(), java.findOne({isLatest: true}).lean(), pocketminemmp.findOne({isLatest: true}).lean(), spigot.findOne({isLatest: true}).lean()]).then(([ bedrockVersions, javaVersions, pocketmineVersions, spigotVersions ]) => {
  const data = {};
  const host = `${req.protocol}://${req.headers.host||"mcpeversions.sirherobrine23.org"}`;
  if (bedrockVersions) data["bedrock"] = {version: bedrockVersions.version, search: `${host}/bedrock/search?version=${bedrockVersions.version}`};
  if (javaVersions) data["java"] = {version: javaVersions.version, search: `${host}/java/search?version=${javaVersions.version}`};
  if (pocketmineVersions) data["pocketmine"] = {version: pocketmineVersions.version, search: `${host}/pocketmine/search?version=${pocketmineVersions.version}`};
  if (spigotVersions) data["spigot"] = {version: spigotVersions.version, search: `${host}/spigot/search?version=${spigotVersions.version}`};
  return res.json(data);
}).catch(err => res.status(500).json({message: "Sorry for error on our part", Error: String(err).replace("Error: ", "")})));

// Routes
app.use("/bedrock", bedrockExpress);
app.use("/java", javaExpress);
app.use("/pocketmine", pocketmineExpress);
app.use("/spigot", spigotExpress);

//Return 404 for all other routes
app.all("*", ({res}) => res.status(404).json({error: "Not found"}));