#!/usr/bin/env node
if (!(!!process.env.MONGO_USER && !!process.env.MONGO_PASSWORD)) {
  console.error("Please set MONGO_USER and MONGO_PASSWORD environment variables");
  process.exit(1);
}
import bedrock from "./ServerFetchs/Bedrock";
import pocketmine from "./ServerFetchs/Pocketmine";
import java from "./ServerFetchs/Java";
import spigot from "./ServerFetchs/Spigot";

bedrock().then(data => {
  if (data.old.version !== data.new.version) console.log(`Bedrock: Update from ${data.old.version} to ${data.new.version}`);
  else console.log(`Bedrock: No update`);
}).catch(err => {
  console.error("Bedrock fetch in fetch new version error:\n******Error******\n");
  console.error(err.response?.data?.toString() || err.message || err);
  console.error(err);
  console.error("Bedrock fetch in fetch new version error:\n******Error******\n");
})
.then(() => java().then(data => {
  if (data.old.version !== data.new.version) console.log(`Java: Update from ${data.old.version} to ${data.new.version}`);
  else console.log(`Java: No update`);
}).catch(err => {
  console.error("Java fetch in fetch new version error:\n******Error******\n");
  console.error(err.response?.data?.toString() || err.message || err);
  console.error(err);
  console.error("Java fetch in fetch new version error:\n******Error******\n");
}))
.then(() => pocketmine().then(data => {
  if (data.old.version !== data.new.version) console.log(`Pocketmine PMMP: Update from ${data.old.version} to ${data.new.version}`);
  else console.log(`Pocketmine PMMP: No update`);
}).catch(err => {
  console.error("Pocketmine fetch in fetch new version error:\n******Error******\n");
  console.error(err.response?.data?.toString() || err.message || err);
  console.error(err);
  console.error("Pocketmine fetch in fetch new version error:\n******Error******\n");
}))
.then(() => spigot().then(data => {
  if (data.old.version !== data.new.version) console.log(`Spigot: Update from ${data.old.version} to ${data.new.version}`);
  else console.log(`Spigot: No update`);
}).catch(err => {
  console.error("Spigot fetch in fetch new version error:\n******Error******\n");
  console.error(err.response?.data?.toString() || err.message || err);
  console.error(err);
  console.error("Spigot fetch in fetch new version error:\n******Error******\n");
}))
.then(() => {
  console.log("Done fetch new version");
  process.exit(0);
})