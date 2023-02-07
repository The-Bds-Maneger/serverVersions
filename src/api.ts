import https from "node:https";
import http from "node:http";
import yaml from "yaml";
import express from "express";
import cors from "cors";

// Db And routes
import dbConnect from "./db/connect.js";
import {getAll as bedrock ,app as bedrockExpress} from "./db/bedrock.js";
import {java, app as javaExpress} from "./db/java.js";
import {pocketmine as pocketminemmp, app as pocketmineExpress} from "./db/pocketmine.js";
import {spigot, app as spigotExpress} from "./db/spigot.js";
import { powernukkit, app as powernukkitExpress } from "./db/powernukkit.js";
import { paper, app as paperExpress } from "./db/paper.js";

const app = express();
app.disable("x-powered-by");
app.disable("etag");
app.use(cors());
app.use((req, res, next) => {
  res.json = (body) => {
    const deleteKeys = ["__v", "_id"];
    if (body instanceof Array) {
      if (body[0] instanceof Object) {
        if (body[0]?.date instanceof Date) body = body.sort((b, a) => a.date?.getTime() - b.date?.getTime());
      }
    }
    body = JSON.parse(JSON.stringify(body, (key, value)=>deleteKeys.includes(key)?undefined:value));
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
  bedrock().then(res => res.at(-1)),
  java.findOne({latest: true}).lean().then(res => res ?? java.findOne().sort({version: -1}).lean()),
  pocketminemmp.findOne({latest: true}).lean().then(res => res ?? pocketminemmp.findOne().sort({date: -1}).lean()),
  spigot.findOne({latest: true}).lean().then(res => res ?? spigot.findOne().sort({date: -1}).lean()),
  paper.findOne({latest: true}).lean().then(res => res ?? paper.findOne().sort({date: -1}).lean()),
  powernukkit.findOne({latest: true}).lean().then(res => res ?? powernukkit.findOne().sort({date: -1}).lean()),
]);
app.get("/", (req, res) => getAllLatest().then(([bedrockVersions, javaVersions, pocketmineVersions, spigotVersions, paperVersions, powerNukkitVersions]) => {
  const data = {};
  const host = `${req.protocol}://${req.headers.host||"mcpeversions.sirherobrine23.org"}`;
  if (bedrockVersions) data["bedrock"] = {version: bedrockVersions.version, search: `${host}/bedrock/search?version=${bedrockVersions.version}`};
  if (javaVersions) data["java"] = {version: javaVersions.version, search: `${host}/java/search?version=${javaVersions.version}`};
  if (pocketmineVersions) data["pocketmine"] = {version: pocketmineVersions.version, search: `${host}/pocketmine/search?version=${pocketmineVersions.version}`};
  if (spigotVersions) data["spigot"] = {version: spigotVersions.version, search: `${host}/spigot/search?version=${spigotVersions.version}`};
  if (paperVersions) data["paper"] = {version: paperVersions.version, search: `${host}/paper/search?version=${paperVersions.version}`};
  if (powerNukkitVersions) data["powernukkit"] = {version: powerNukkitVersions.version, search: `${host}/powernukkit/search?version=${powerNukkitVersions.version}`};
  return res.json(data);
}).catch(err => res.status(500).json({message: "Sorry for error on our part", Error: JSON.stringify(err)})));

// Routes
app.use("/bedrock", bedrockExpress);
app.use("/java", javaExpress);
app.use("/pocketmine", pocketmineExpress);
app.use("/spigot", spigotExpress);
app.use("/powernukkit", powernukkitExpress);
app.use("/paper", paperExpress);

//Return 404 for all other routes
app.all("*", ({res}) => res.status(404).json({error: "Not found"}));
