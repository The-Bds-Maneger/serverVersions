#!/usr/bin/env node
import yargs from "yargs";
import bedrock from "./Bedrock";
import pocketmine from "./Pocketmine";
import java from "./Java";
import spigot from "./Spigot";
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

async function all() {
  await bedrock()
  await java();
  await pocketmine();
  await spigot();
}

if (options.bedrock) bedrock().then(() => {console.log("Bedrock sucess update"); process.exit(0)}).catch(err => {console.log("Bedrock catch Error: %s", String(err)); process.exit(1)});
else if (options.java) java().then(() => {console.log("Java sucess update"); process.exit(0)}).catch(err => {console.log("Java catch Error: %s", String(err)); process.exit(1)});
else if (options.spigot) spigot().then(() => {console.log("Spigot sucess update"); process.exit(0)}).catch(err => {console.log("Spigot catch Error: %s", String(err)); process.exit(1)});
else if (options.pocketmine) pocketmine().then(() => {console.log("Pocketmine sucess update"); process.exit(0)}).catch(err => {console.log("Pocketmine catch Error: %s", String(err)); process.exit(1)});
else if (options.all) all().then(() => process.exit(0)).catch(err => {console.trace(err); process.exit(1)});
else {
  console.log("No options set");
  process.exit(1);
}