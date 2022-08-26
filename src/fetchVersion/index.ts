#!/usr/bin/env node
import yargs from "yargs";
import bedrock from "./ServerFetchs/Bedrock";
import pocketmine from "./ServerFetchs/Pocketmine";
import java from "./ServerFetchs/Java";
import spigot from "./ServerFetchs/Spigot";
const options = yargs(process.argv.slice(2)).help().version(false).alias("h", "help").wrap(yargs.terminalWidth()).options("all", {
  alias: "a",
  description: "Fetch all plaftorms",
  type: "boolean"
}).option("bedrock", {
  alias: "b",
  description: "Fetch Bedrock versions",
  type: "boolean"
}).option("java", {
  alias: "v",
  description: "Fetch Java versions",
  type: "boolean"
}).option("pocketmine", {
  alias: "p",
  description: "Fetch Pocketmine-MP versions",
  type: "boolean"
}).option("spigot", {
  alias: "s",
  description: "Fetch Spigot versions",
  type: "boolean"
}).parseSync();
if (!process.env.MONGO_USER && !process.env.MONGO_PASSWORD) {
  console.error("Please set MONGO_USER and MONGO_PASSWORD environment variables");
  process.exit(1);
}
if (options.all) Promise.all([bedrock(), java(), pocketmine(), spigot()]).then(() => {console.log("Sucess update all plaftorms"); process.exit(1)}).catch(err => {console.log("Oh no catch error: %s", String(err)), process.exit(1)});
else if (options.bedrock) bedrock().then(() => {console.log("Bedrock sucess update"); process.exit(0)}).catch(err => {console.log("Bedrock catch Error: %s", String(err)); process.exit(1)});
else if (options.java) java().then(() => {console.log("Java sucess update"); process.exit(0)}).catch(err => {console.log("Java catch Error: %s", String(err)); process.exit(1)});
else if (options.spigot) spigot().then(() => {console.log("Spigot sucess update"); process.exit(0)}).catch(err => {console.log("Spigot catch Error: %s", String(err)); process.exit(1)});
else if (options.pocketmine) pocketmine().then(() => {console.log("Pocketmine sucess update"); process.exit(0)}).catch(err => {console.log("Pocketmine catch Error: %s", String(err)); process.exit(1)});
else {
  console.log("No options set");
  process.exit(1);
}