#!/usr/bin/env node
if (!(!!process.env.MONGO_USER && !!process.env.MONGO_PASSWORD)) {
  console.error("Please set MONGO_USER and MONGO_PASSWORD environment variables");
  process.exit(1);
}
import bedrock from "./ServerFetchs/Bedrock";
import pocketmine from "./ServerFetchs/Pocketmine";
import java from "./ServerFetchs/Java";
import spigot from "./ServerFetchs/Spigot";

const fetchErros = {
  bedrock: undefined,
  pocketmine: undefined,
  java: undefined,
  spigot: undefined
}
console.log("Fetching oficial versions versions...");
Promise.all([
  bedrock().catch(err => fetchErros.bedrock = err),
  java().catch(err => fetchErros.java = err)
]).then(() => {
  console.log("Fetching oficial versions versions... done");
  console.log("Fetching alternative versions versions...");
  return Promise.all([
    pocketmine().catch(err => fetchErros.pocketmine = err),
    spigot().catch(err => fetchErros.spigot = err)
  ]).then(() => {
    console.log("Fetching alternative versions versions... done");
  });
}).then(() => {
  if (!fetchErros.bedrock||!fetchErros.java||!fetchErros.pocketmine||!fetchErros.spigot) {
    if (fetchErros.bedrock) console.error("Bedrock Error:", fetchErros.bedrock);
    if (fetchErros.java) console.error("Java Error:", fetchErros.java);
    if (fetchErros.pocketmine) console.error("Pocketmine Error:", fetchErros.pocketmine);
    if (fetchErros.spigot) console.error("Spigot Error:", fetchErros.spigot);
  }
  console.log("Done fetch new version");
  process.exit(0);
})