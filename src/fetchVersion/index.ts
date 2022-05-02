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
console.log("Fetching versions...");
const Bedrock = bedrock().catch(err => fetchErros.bedrock = err);

const Java = java().catch(err => fetchErros.java = err);

const Pocketmine = pocketmine().catch(err => fetchErros.pocketmine = err);

const Spigot = spigot().catch(err => fetchErros.spigot = err);

Bedrock.then(() => Java).then(() => Pocketmine).then(() => Spigot).then(() => {
  if (!fetchErros.bedrock||!fetchErros.java||!fetchErros.pocketmine||!fetchErros.spigot) {
    if (fetchErros.bedrock) console.error("Bedrock Error:", fetchErros.bedrock);
    if (fetchErros.java) console.error("Java Error:", fetchErros.java);
    if (fetchErros.pocketmine) console.error("Pocketmine Error:", fetchErros.pocketmine);
    if (fetchErros.spigot) console.error("Spigot Error:", fetchErros.spigot);
  }
  console.log("Done fetch new version");
  process.exit(0);
})