#!/usr/bin/env node
import yargs from "yargs";
import { platformManeger } from "./index";

function prettyDate(date: Date): string {
  const day = date.getDay();
  const month = date.getMonth()+1;
  const Year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${day > 9?day:"0"+day}/${month>9?month:"0"+month}/${Year} ${hour>9?hour:"0"+hour}:${minutes>9?minutes:"0"+minutes}`;
}

function stringReplace(messeage: string, ...args: string[]): string {
  const mat = ([...messeage.matchAll(/(%[a-z])/g)]);
  for (const matIndex in mat) {
    const [, text] = mat[matIndex];
    messeage = messeage.replace(text, args[matIndex]);
  }
  return messeage;
}

yargs(process.argv.slice(2)).help().version(false).alias("h", "help").wrap(yargs.terminalWidth()).command("bedrock", "Bedrock Platform", yarg => yarg.option("version", {alias: "v"}), async options => {
  if (options.version && typeof options.version === "string") {
    const data = await platformManeger.bedrock.find(options.version);
    console.log("Version: %s\n\trelease date: %s\n\tUrl: %s", data.version, prettyDate(data.date), data.url[process.platform]||"Current Platform not Avaible")
  } else {
    let consolePrint = "";
    if (Array.isArray(options.version)) {
      for (const version of options.version) {
        const data = await platformManeger.bedrock.find(version).catch(() => null);
        if (!data) continue;
        consolePrint += stringReplace("Version: %s\n\trelease date: %s\n\tUrl: %s\n", data.version, prettyDate(data.date), data.url[process.platform][process.arch]||"Current Platform not Avaible");
      }
    } else {
      for (const version of await platformManeger.bedrock.all()) {
        consolePrint += stringReplace("Version: %s\n\trelease date: %s\n\tUrl: %s\n", version.version, prettyDate(version.date), version.url[process.platform][process.arch]||"Current Platform not Avaible");
      }
    }
    if (!consolePrint.trim()) {
      console.log("No Versions to print!");
      process.exitCode = 1;
      return;
    }
    console.log(consolePrint.trim());
  }
}).command("powernukkit", "powernukkit Platform", yarg => yarg.option("version", {alias: "v"}), async options => {
  if (options.version && typeof options.version === "string") {
    const data = await platformManeger.powernukkit.find(options.version);
    console.log("Version: %s, Minecraft version: %s\n\trelease date: %s\n\tUrl: %s\n", data.version, data.mcpeVersion, prettyDate(data.date), data.url);
  } else {
    let consolePrint = "";
    if (Array.isArray(options.version)) {
      for (const version of options.version) {
        const data = await platformManeger.powernukkit.find(version).catch(() => null);
        if (!data) continue;
        consolePrint += stringReplace("Version: %s, Minecraft version: %s\n\trelease date: %s\n\tUrl: %s\n", data.version, data.mcpeVersion, prettyDate(data.date), data.url);
      }
    } else {
      for (const version of await platformManeger.powernukkit.all()) {
        consolePrint += stringReplace("Version: %s, Minecraft version: %s\n\trelease date: %s\n\tUrl: %s\n", version.version, version.mcpeVersion, prettyDate(version.date), version.url);
      }
    }
    if (!consolePrint.trim()) {
      console.log("No Versions to print!");
      process.exitCode = 1;
      return;
    }
    console.log(consolePrint.trim());
  }
}).command("pocketmine", "pocketmine Platform", yarg => yarg.option("version", {alias: "v"}), async options => {
  if (options.version && typeof options.version === "string") {
    const data = await platformManeger.pocketmine.find(options.version);
    console.log("Version: %s\n\trelease date: %s\n\tUrl: %s\n", data.version, prettyDate(data.date), data.url);
  } else {
    let consolePrint = "";
    if (Array.isArray(options.version)) {
      for (const version of options.version) {
        const data = await platformManeger.pocketmine.find(version).catch(() => null);
        if (!data) continue;
        consolePrint += stringReplace("Version: %s\n\trelease date: %s\n\tUrl: %s\n", data.version, prettyDate(data.date), data.url);
      }
    } else {
      for (const data of await platformManeger.pocketmine.all()) {
        consolePrint += stringReplace("Version: %s\n\trelease date: %s\n\tUrl: %s\n", data.version, prettyDate(data.date), data.url);
      }
    }
    if (!consolePrint.trim()) {
      console.log("No Versions to print!");
      process.exitCode = 1;
      return;
    }
    console.log(consolePrint.trim());
  }
}).command("java", "Java Platform", yarg => yarg.option("version", {alias: "v"}), async options => {
  if (options.version && typeof options.version === "string") {
    const data = await platformManeger.java.find(options.version);
    console.log("Version: %s\n\trelease date: %s\n\tUrl: %s", data.version, prettyDate(data.date), data.url)
  } else {
    let consolePrint = "";
    if (Array.isArray(options.version)) {
      for (const version of options.version) {
        const data = await platformManeger.java.find(version).catch(() => null);
        if (!data) continue;
        consolePrint += stringReplace("Version: %s\n\trelease date: %s\n\tUrl: %s\n", data.version, prettyDate(data.date), data.url);
      }
    } else {
      for (const version of await platformManeger.java.all()) {
        consolePrint += stringReplace("Version: %s\n\trelease date: %s\n\tUrl: %s\n", version.version, prettyDate(version.date), version.url);
      }
    }
    if (!consolePrint.trim()) {
      console.log("No Versions to print!");
      process.exitCode = 1;
      return;
    }
    console.log(consolePrint.trim());
  }
}).command("spigot", "spigot Platform", yarg => yarg.option("version", {alias: "v"}), async options => {
  if (options.version && typeof options.version === "string") {
    const data = await platformManeger.spigot.find(options.version);
    console.log("Version: %s\n\trelease date: %s\n\tUrl: %s", data.version, prettyDate(data.date), data.url)
  } else {
    let consolePrint = "";
    if (Array.isArray(options.version)) {
      for (const version of options.version) {
        const data = await platformManeger.spigot.find(version).catch(() => null);
        if (!data) continue;
        consolePrint += stringReplace("Version: %s\n\trelease date: %s\n\tUrl: %s\n", data.version, prettyDate(data.date), data.url);
      }
    } else {
      for (const version of await platformManeger.spigot.all()) {
        consolePrint += stringReplace("Version: %s\n\trelease date: %s\n\tUrl: %s\n", version.version, prettyDate(version.date), version.url);
      }
    }
    if (!consolePrint.trim()) {
      console.log("No Versions to print!");
      process.exitCode = 1;
      return;
    }
    console.log(consolePrint.trim());
  }
}).command("paper", "paper Platform", yarg => yarg.option("version", {alias: "v"}), async options => {
  if (options.version && typeof options.version === "string") {
    const data = await platformManeger.paper.find(options.version);
    console.log("Version: %s\n\trelease date: %s\n\tUrl: %s", data.version, prettyDate(data.date), data.url)
  } else {
    let consolePrint = "";
    if (Array.isArray(options.version)) {
      for (const version of options.version) {
        const data = await platformManeger.paper.find(version).catch(() => null);
        if (!data) continue;
        consolePrint += stringReplace("Version: %s\n\trelease date: %s\n\tUrl: %s\n", data.version, prettyDate(data.date), data.url);
      }
    } else {
      for (const version of await platformManeger.paper.all()) {
        consolePrint += stringReplace("Version: %s\n\trelease date: %s\n\tUrl: %s\n", version.version, prettyDate(version.date), version.url);
      }
    }
    if (!consolePrint.trim()) {
      console.log("No Versions to print!");
      process.exitCode = 1;
      return;
    }
    console.log(consolePrint.trim());
  }
})
.parseAsync();