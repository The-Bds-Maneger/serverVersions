"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_https_1 = __importDefault(require("node:https"));
const node_http_1 = __importDefault(require("node:http"));
const yaml_1 = __importDefault(require("yaml"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Db And routes
const connect_1 = __importDefault(require("./db/connect"));
const bedrock_1 = require("./db/bedrock");
const java_1 = require("./db/java");
const pocketmine_1 = require("./db/pocketmine");
const spigot_1 = require("./db/spigot");
const powernukkit_1 = require("./db/powernukkit");
const paper_1 = require("./db/paper");
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.disable("etag");
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    res.json = (body) => {
        var _a;
        const deleteKeys = ["__v", "_id"];
        if (body instanceof Array) {
            if (body[0] instanceof Object) {
                if (((_a = body[0]) === null || _a === void 0 ? void 0 : _a.date) instanceof Date)
                    body = body.sort((b, a) => { var _a, _b; return ((_a = a.date) === null || _a === void 0 ? void 0 : _a.getTime()) - ((_b = b.date) === null || _b === void 0 ? void 0 : _b.getTime()); });
            }
        }
        body = JSON.parse(JSON.stringify(body, (key, value) => deleteKeys.includes(key) ? undefined : value));
        if (req.query.type === "yaml" || req.query.type === "yml")
            return res.setHeader("Content-Type", "text/yaml").send(yaml_1.default.stringify(body));
        return res.set("Content-Type", "application/json").send(JSON.stringify(body, (_, value) => typeof value === "bigint" ? value.toString() : value, 2));
    };
    return next();
});
// Ping
app.all("/ping", ({ res }) => res.status(200).json({ status: "Ok", from: process.env.RUNNINGON || "unknown" }));
app.all(/^\/favicon.*/, ({ res }) => res.redirect("https://raw.githubusercontent.com/The-Bds-Maneger/Bds-Maneger-html-assets/main/images/mcpe.ico"));
// Listen server
connect_1.default.once("connected", () => {
    // Listen ports
    const portsListen = { http: process.env.PORT || 8080, https: process.env.PORTS || 8443 };
    node_http_1.default.createServer(app).listen(portsListen.http, () => console.log("(HTTP) Listening on port %o", portsListen.http));
    if (process.env.KEY && process.env.CERT)
        node_https_1.default.createServer({ key: process.env.KEY, cert: process.env.CERT }, app).listen(portsListen.https, () => console.log("(HTTPS) Listening on port %o", portsListen.https));
});
// Print user request api
app.use((req, _res, next) => {
    next();
    console.log("(%s %s): %s %s", req.protocol, req.ip, req.method, req.originalUrl);
});
// Global version
const getAllLatest = () => Promise.all([
    (0, bedrock_1.getAll)().then(res => res.at(-1)),
    java_1.java.findOne({ latest: true }).lean(),
    pocketmine_1.pocketmine.findOne({ latest: true }).lean(),
    spigot_1.spigot.findOne({ latest: true }).lean(),
    paper_1.paper.findOne({ latest: true }).lean(),
    powernukkit_1.powernukkit.findOne({ latest: true }).lean(),
]);
app.get("/", (req, res) => getAllLatest().then(([bedrockVersions, javaVersions, pocketmineVersions, spigotVersions, paperVersions, powerNukkitVersions]) => {
    const data = {};
    const host = `${req.protocol}://${req.headers.host || "mcpeversions.sirherobrine23.org"}`;
    if (bedrockVersions)
        data["bedrock"] = { version: bedrockVersions.version, search: `${host}/bedrock/search?version=${bedrockVersions.version}` };
    if (javaVersions)
        data["java"] = { version: javaVersions.version, search: `${host}/java/search?version=${javaVersions.version}` };
    if (pocketmineVersions)
        data["pocketmine"] = { version: pocketmineVersions.version, search: `${host}/pocketmine/search?version=${pocketmineVersions.version}` };
    if (spigotVersions)
        data["spigot"] = { version: spigotVersions.version, search: `${host}/spigot/search?version=${spigotVersions.version}` };
    if (paperVersions)
        data["paper"] = { version: paperVersions.version, search: `${host}/paper/search?version=${paperVersions.version}` };
    if (powerNukkitVersions)
        data["powernukkit"] = { version: powerNukkitVersions.version, search: `${host}/powernukkit/search?version=${powerNukkitVersions.version}` };
    return res.json(data);
}).catch(err => res.status(500).json({ message: "Sorry for error on our part", Error: String(err).replace("Error: ", "") })));
// Routes
app.use("/bedrock", bedrock_1.app);
app.use("/java", java_1.app);
app.use("/pocketmine", pocketmine_1.app);
app.use("/spigot", spigot_1.app);
app.use("/powernukkit", powernukkit_1.app);
app.use("/paper", paper_1.app);
//Return 404 for all other routes
app.all("*", ({ res }) => res.status(404).json({ error: "Not found" }));
