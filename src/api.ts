import https from "node:https";
import http from "node:http";
import yaml from "yaml";
import express from "express";
import cors from "cors";

// Db And routes
import dbConnect from "./db/connect";
import {bedrock, app as bedrockExpress} from "./db/bedrock";
import {java, app as javaExpress} from "./db/java";
import {pocketmine as pocketminemmp, app as pocketmineExpress} from "./db/pocketmine";
import {spigot, app as spigotExpress} from "./db/spigot";
import { nukkit, app as nukkitExpress } from "./db/nukkit";
import { powernukkit, app as powernukkitExpress } from "./db/powernukkit";
import { paper, app as paperExpress } from "./db/paper";

const app = express();
app.disable("x-powered-by");
app.disable("etag");
app.use(cors());
app.use((req, res, next) => {
  res.json = (body) => {
    const deleteKeys = ["__v", "_id"];
    body = JSON.parse(JSON.stringify(body, (key, value)=>deleteKeys.includes(key)?undefined:value));
    if (body instanceof Array) {
      if (body[0]?.date instanceof Date) body = body.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    if (req.query.type === "yaml"||req.query.type === "yml") return res.setHeader("Content-Type", "text/yaml").send(yaml.stringify(body));
    return res.set("Content-Type", "application/json").send(JSON.stringify(body, (_, value) => typeof value === "bigint" ? value.toString():value, 2));
  }
  return next();
});

// Ping
app.all("/ping", ({res}) => res.status(200).json({status: "Ok", from: process.env.RUNNINGON||"unknown"}));
app.all(/^\/favicon.*/, ({res}) => res.redirect("https://raw.githubusercontent.com/The-Bds-Maneger/Bds-Maneger-html-assets/main/images/mcpe.ico"));

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
  console.log("(%s %s): %s %s", req.protocol, req.ip, req.method, req.originalUrl);
});

// Global version
const getAllLatest = () => Promise.all([
  bedrock.findOne({latest: true}).lean(),
  java.findOne({latest: true}).lean(),
  pocketminemmp.findOne({latest: true}).lean(),
  spigot.findOne({latest: true}).lean(),
  paper.findOne({latest: true}).lean(),
  nukkit.findOne({latest: true}).lean(),
  powernukkit.findOne({latest: true}).lean(),
]);
app.get("/", (req, res) => getAllLatest().then(([bedrockVersions, javaVersions, pocketmineVersions, spigotVersions, paperVersions, nukkitVersions, powerNukkitVersions]) => {
  const data = {};
  const host = `${req.protocol}://${req.headers.host||"mcpeversions.sirherobrine23.org"}`;
  if (bedrockVersions) data["bedrock"] = {version: bedrockVersions.version, search: `${host}/bedrock/search?version=${bedrockVersions.version}`};
  if (javaVersions) data["java"] = {version: javaVersions.version, search: `${host}/java/search?version=${javaVersions.version}`};
  if (pocketmineVersions) data["pocketmine"] = {version: pocketmineVersions.version, search: `${host}/pocketmine/search?version=${pocketmineVersions.version}`};
  if (spigotVersions) data["spigot"] = {version: spigotVersions.version, search: `${host}/spigot/search?version=${spigotVersions.version}`};
  if (paperVersions) data["paper"] = {version: paperVersions.version, search: `${host}/spigot/search?version=${paperVersions.version}`};
  if (nukkitVersions) data["nukkit"] = {version: nukkitVersions.version, search: `${host}/spigot/search?version=${nukkitVersions.version}`};
  if (powerNukkitVersions) data["powernukkit"] = {version: powerNukkitVersions.version, search: `${host}/spigot/search?version=${powerNukkitVersions.version}`};
  return res.json(data);
}).catch(err => res.status(500).json({message: "Sorry for error on our part", Error: String(err).replace("Error: ", "")})));

// Routes
app.use("/bedrock", bedrockExpress);
app.use("/java", javaExpress);
app.use("/pocketmine", pocketmineExpress);
app.use("/spigot", spigotExpress);
app.use("/nukkit", nukkitExpress);
app.use("/powernukkit", powernukkitExpress);
app.use("/paper", paperExpress);

//Return 404 for all other routes
app.all("*", ({res}) => res.status(404).json({error: "Not found"}));
