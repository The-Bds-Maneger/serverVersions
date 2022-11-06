import { requestOptions, pipeFetch } from "./simples";
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import AdmZip from "adm-zip";

export async function saveFile(request: string|requestOptions & {filePath?: string}) {
  if (typeof request === "string") request = {url: request};
  const filePath = request.filePath||path.join(os.tmpdir(), `raw_bdscore_${Date.now()}_${(path.parse(request.url||request.socket?.path||crypto.randomBytes(16).toString("hex"))).name}`);
  await pipeFetch({...request, waitFinish: true, stream: fs.createWriteStream(filePath, {autoClose: false})});
  return filePath;
}

export async function zip(request: requestOptions) {
  return new AdmZip(await saveFile(request));
}

const githubAchive = /github.com\/[\S\w]+\/[\S\w]+\/archive\//;
export async function extractZip(request: requestOptions & {folderTarget: string}) {
  const zipFile = await zip(request);
  const targetFolder = githubAchive.test(request.url)?await fs.promises.mkdtemp(path.join(os.tmpdir(), "githubRoot_"), "utf8"):request.folderTarget;
  await new Promise<void>((done, reject) => {
    zipFile.extractAllToAsync(targetFolder, true, true, (err) => {
      if (!err) return done();
      return reject(err);
    })
  });

  if (githubAchive.test(request.url)) {
    const files = await fs.promises.readdir(targetFolder);
    if (files.length === 0) throw new Error("Invalid extract");
    await fs.promises.cp(path.join(targetFolder, files[0]), request.folderTarget, {recursive: true, force: true, preserveTimestamps: true, verbatimSymlinks: true});
    return await fs.promises.rm(targetFolder, {recursive: true, force: true});
  }
  return;
}