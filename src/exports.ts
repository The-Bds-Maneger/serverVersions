import * as path from "node:path";
import { writeFile } from "node:fs/promises";
import { bedrock } from "./db/bedrock";
import { java } from "./db/java";
import { pocketmine } from "./db/pocketmine";
import { spigot } from "./db/spigot";
import { powernukkit } from "./db/powernukkit";
import { paper } from "./db/paper";

const exportVersions = () => Promise.all([
  bedrock.find().lean(),
  java.find().lean(),
  pocketmine.find().lean(),
  spigot.find().lean(),
  paper.find().lean(),
  powernukkit.find().lean()
]).then(([bedrock, java, pocketmine, spigot, paper, powernukkit]) => JSON.stringify({bedrock, java, pocketmine, spigot, paper, powernukkit}, (key, value)=>key==="__v"?undefined:key==="_id"?undefined:value, 2));

const outputFile = process.env.OUTPUT?path.resolve(process.env.OUTPUT):path.join(process.cwd(), "versions.json");
exportVersions().then(res => writeFile(outputFile, /\.md$/.test(outputFile)?`#Result\n\n\`\`\`json\n${res}\n\`\`\`\n`:res)).then(() => {console.log("File save in '%s' path.", outputFile); process.exit(0)});
