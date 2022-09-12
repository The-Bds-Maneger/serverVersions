import { powernukkit } from "../db/powernukkit";
import chromium from "chromium";
import { Browser, launch } from "puppeteer";
// import log from "../lib/logging";
import jsdom from "jsdom";

// Original author of this file: https://github.com/karelkryda
// Original File url: https://github.com/karelkryda/universal-speedtest/blob/master/src/Utils.ts
async function ChromiumLauch(executablePath?: string) {
  //Launches Puppeteer browser for Windows and MacOS
  return launch({ executablePath: chromium.path, args: ["--no-sandbox"] })
  //Launches the Puppeteer browser for Linux systems based on ARM processors
  .catch(() => launch({ executablePath: "/usr/bin/chromium-browser", args: ["--no-sandbox"] }))
  //Launches the Puppeteer browser using a user-specified path
  .catch(() =>launch({ executablePath, args: ["--no-sandbox"]}));
}

export default async function find() {
  const browser = await ChromiumLauch() as Browser;
  const page = await browser.newPage();
  await page.goto("https://powernukkit.org/");

  // Get Html
  await page.waitForSelector("body > div.site-wrap > section:nth-child(7) > div.container-fluid > div", {/*timeout: 0*/});
  const htmlString: string|undefined = await page.evaluate(() => document.querySelector("body > div.site-wrap > section:nth-child(7) > div.container-fluid > div")?.outerHTML||undefined);
  await browser.close();
  const {document} = new jsdom.JSDOM(htmlString).window;
  // Stable
  const versionList: {version: string, mcpeVersion: string, date: Date, url: string}[] = [];
  document.querySelectorAll("#stable-releases > div").forEach(doc => {
    versionList.push({
      version: doc.querySelector("div.col.text-left.align-bottom.mt-auto.mb-auto.text-nowrap.pn-version").innerHTML,
      mcpeVersion: doc.querySelector("div:nth-child(3) > a.btn.btn-primary.download-jar-button > span.minecraft-version").innerHTML,
      date: new Date(([doc.querySelector("div:nth-child(2) > span:nth-child(1)").textContent, doc.querySelector("div:nth-child(2) > span:nth-child(2)").textContent]).join(" ")),
      url: doc.querySelector("div:nth-child(3) > a:nth-child(1)")["href"] as string
    });
  });
  // Testing
  document.querySelectorAll("#unstable-versions > div").forEach(doc => {
    versionList.push({
      version: doc.querySelector("div.col.text-left.align-bottom.mt-auto.mb-auto.text-nowrap.pn-version").innerHTML,
      // div:nth-child(3) > a.btn.download-jar-button.btn-outline-secondary > span.minecraft-version
      mcpeVersion: doc.querySelector("div:nth-child(3) > a.btn.download-jar-button.btn-outline-secondary > span.minecraft-version").innerHTML,
      date: new Date(([doc.querySelector("div:nth-child(2) > span:nth-child(1)").textContent, doc.querySelector("div:nth-child(2) > span:nth-child(2)").textContent]).join(" ")),
      url: doc.querySelector("div:nth-child(3) > a:nth-child(1)")["href"] as string
    });
  });
  if (versionList.length === 0) throw new Error("No versions");
  const res = await Promise.all(versionList.sort((a, b) => a.date.getTime() - b.date.getTime()).reverse().map(async data => {
    if (await powernukkit.findOne({version: data.version}).lean().then(data => !!data).catch(() => true)) return Promise.resolve(null);
    return powernukkit.create({
      version: data.version,
      mcpeVersion: data.mcpeVersion,
      date: data.date,
      url: data.url,
      variantType: data.version.includes("SNAPSHOT")?"snapshot":data.version.includes("ALPHA")?"alpha":"stable",
      latest: false
    }).then(() => null).catch(err => err);
  }));
  if (res.filter(a => a).length > 0) throw res.filter(a => a);
  const latestVersion = versionList.sort((a, b) => a.date.getTime() - b.date.getTime()).filter(data => (data.version.includes("SNAPSHOT")?"snapshot":data.version.includes("ALPHA")?"alpha":"stable") === "stable").reverse()[0];
  const oldLatest = await powernukkit.findOneAndUpdate({latest: true}, {$set: {latest: false}}).lean();
  await powernukkit.findOneAndUpdate({version: latestVersion.version, variant: {variantType: "stable"}}, {$set: {latest: true}}).lean().catch(err => powernukkit.findOneAndUpdate({version: oldLatest.version}, {$set: {latest: true}}).lean().then(() => Promise.reject(err)));
  return;
}