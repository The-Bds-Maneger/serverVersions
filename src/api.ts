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
app.get("/", async ({res}) => {
  try {
    const [ bedrockVersions, javaVersions, pocketmineVersions, spigotVersions ] = await Promise.all([bedrock.find().lean(), java.find().lean(), pocketminemmp.find().lean(), spigot.find().lean()]);
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