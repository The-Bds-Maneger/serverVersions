#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const Pocketmine_1 = __importDefault(require("./Pocketmine"));
const Java_1 = __importDefault(require("./Java"));
const Spigot_1 = __importDefault(require("./Spigot"));
const Paper_1 = __importDefault(require("./Paper"));
const Powernukkit_1 = __importDefault(require("./Powernukkit"));
const options = (0, yargs_1.default)(process.argv.slice(2)).help().version(false).alias("h", "help").wrap(yargs_1.default.terminalWidth()).options("all", {
    description: "Fetch all plaftorms",
    type: "boolean"
}).option("java", {
    description: "Fetch Java versions",
    type: "boolean"
}).option("pocketmine", {
    description: "Fetch Pocketmine-MP versions",
    type: "boolean"
}).option("spigot", {
    description: "Fetch Spigot versions",
    type: "boolean"
}).option("paper", {
    description: "Fetch Paper versions",
    type: "boolean"
}).option("powernukkit", {
    description: "Fetch Powernukkit versions",
    type: "boolean"
})
    .parseSync();
async function all() {
    await (0, Java_1.default)();
    await (0, Pocketmine_1.default)();
    await (0, Spigot_1.default)();
    await (0, Paper_1.default)();
    await (0, Powernukkit_1.default)();
}
if (options.java)
    (0, Java_1.default)().then(() => { console.log("Java sucess update"); process.exit(0); }).catch(err => { console.log("Java catch Error: %s", String(err)); process.exit(1); });
else if (options.spigot)
    (0, Spigot_1.default)().then(() => { console.log("Spigot sucess update"); process.exit(0); }).catch(err => { console.log("Spigot catch Error: %s", String(err)); process.exit(1); });
else if (options.pocketmine)
    (0, Pocketmine_1.default)().then(() => { console.log("Pocketmine sucess update"); process.exit(0); }).catch(err => { console.log("Pocketmine catch Error: %s", String(err)); process.exit(1); });
else if (options.paper)
    (0, Paper_1.default)().then(() => { console.log("Paper sucess update"); process.exit(0); }).catch(err => { console.log("Paper catch Error: %s", String(err)); process.exit(1); });
else if (options.powernukkit)
    (0, Powernukkit_1.default)().then(() => { console.log("Powernukkit sucess update"); process.exit(0); }).catch(err => { console.log("Powernukkit catch Error: %s", String(err)); process.exit(1); });
else if (options.all)
    all().then(() => process.exit(0)).catch(err => { console.trace(err); process.exit(1); });
else {
    console.log("No options set");
    process.exit(1);
}
