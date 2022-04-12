#!/usr/bin/env node
if (!(!!process.env.MONGO_USER && !!process.env.MONGO_PASSWORD)) {
  console.error("Please set MONGO_USER and MONGO_PASSWORD environment variables");
  process.exit(1);
}
import bedrock from "./ServerFetchs/Bedrock";
import pocketmine from "./ServerFetchs/Pocketmine";
import java from "./ServerFetchs/Java";
import spigot from "./ServerFetchs/Spigot";
import bedrockMongo from "../model/bedrock";
import pocketmineMongo from "../model/pocketmine";
import javaMongo from "../model/java";
import spigotMongo from "../model/spigot";

(async function () {
  await Promise.all([
    bedrock().then(async data => {
      const latestVersion = await bedrockMongo.findOne({ isLatest: true }).lean();
      console.log("Bedrock latest version, in database: \"%s\", find: \"%s\"", latestVersion.version, data.version);
      if (await bedrockMongo.findOne({ version: data.version }).lean().then(data => !!data ? false : true).catch(() => false)) {
        console.log("Add Pocketmine version: \"%s\"", data.version);
        if (data.version !== latestVersion.version) {
          latestVersion.isLatest = false;
          await bedrockMongo.updateOne({ _id: latestVersion._id }, latestVersion);
        }
        await bedrockMongo.create({
          version: data.version,
          datePublish: data.Date,
          isLatest: data.version !== latestVersion.version,
          win32: {
            x64: data.data.win32.x64,
            arm64: data.data.win32.aarch64
          },
          linux: {
            x64: data.data.linux.x64,
            arm64: data.data.linux.aarch64
          },
          darwin: {
            x64: data.data.darwin.x64,
            arm64: data.data.darwin.aarch64
          }
        });
      }
    }),
    java().then(async data => {
      const latestVersion = await javaMongo.findOne({ isLatest: true }).lean();
      console.log("Java latest version, in database: \"%s\", find: \"%s\"", latestVersion.version, data.Version);
      if (await javaMongo.findOne({ version: data.Version }).lean().then(data => !!data ? false : true).catch(() => false)) {
        if (data.Version !== latestVersion.version) {
          latestVersion.isLatest = false;
          await javaMongo.updateOne({ _id: latestVersion._id }, latestVersion);
        }
        await javaMongo.create({
          version: data.Version,
          datePublish: data.Date,
          isLatest: data.Version !== latestVersion.version,
          javaJar: data.data
        });
      }
    }),
    pocketmine().then(async data => {
      const latestVersion = await pocketmineMongo.findOne({ isLatest: true }).lean();
      console.log("Pocketmine latest version, in database: \"%s\", find: \"%s\"", latestVersion.version, data[0].Version);
      latestVersion.isLatest = false;
      await pocketmineMongo.updateOne({ _id: latestVersion._id }, latestVersion);
      for (const version of data) {
        if (await pocketmineMongo.findOne({ version: version.Version }).lean().then(data => !!data ? false : true).catch(() => false)) {
          console.log("Add Pocketmine version: \"%s\"", version.Version);
          await pocketmineMongo.create({
            version: version.Version,
            datePublish: version.Date,
            isLatest: false,
            pocketminePhar: version.data
          });
        }
      }
      const latestDatabase = await pocketmineMongo.findOne({ version: data[0].Version }).lean();
      latestDatabase.isLatest = true;
      await pocketmineMongo.updateOne({ _id: latestDatabase._id }, latestDatabase);
    }),
    spigot().then(async data => {
      const latestVersion = await spigotMongo.findOne({ isLatest: true }).lean();
      console.log("Spigot latest version, in database: \"%s\", find: \"%s\"", latestVersion.version, data[0].version);
      latestVersion.isLatest = false;
      await spigotMongo.updateOne({ _id: latestVersion._id }, latestVersion);
      for (const version of data) {
        if (await spigotMongo.findOne({ version: version.version }).lean().then(data => !!data ? false : true).catch(() => false)) {
          console.log("Add Spigot version: \"%s\"", version.version);
          await spigotMongo.create({
            version: version.version,
            datePublish: version.Date,
            isLatest: false,
            spigotJar: version.url
          });
        }
      }
      const latestDatabase = await spigotMongo.findOne({ version: data[0].version }).lean();
      latestDatabase.isLatest = true;
      await spigotMongo.updateOne({ _id: latestDatabase._id }, latestDatabase);
    })
  ]);
})().then(() => {
  console.log("Done");
  process.exit(0);
}).catch(err => {
  console.log(err);
  process.exit(1);
});