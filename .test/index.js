const VersionManeger = require("../src/cjs/index");

describe("Find Version", () => {
  // Bedrock
  it("Local Find Bedrock Syncronous", function(done) {
    VersionManeger.find("latest", "bedrock");
    return done();
  });
  it("Local Find Bedrock Asyncronous", async function() {
    await VersionManeger.findAsync("latest", "bedrock");
    return;
  });
  it("Local Find Bedrock Asyncronous Callback", function(done) {
    VersionManeger.findCallback("latest", "bedrock", (err, Data) => {
      if (err) return done(err);
      return done();
    });
  });
  // Java
  it("Local Find Java Syncronous", function(done) {
    VersionManeger.find("latest", "java");
    return done();
  });
  it("Local Find Java Asyncronous", async function() {
    await VersionManeger.findAsync("latest", "java");
    return;
  });
  it("Local Find Java Asyncronous Callback", function(done) {
    VersionManeger.findCallback("latest", "java", (err, Data) => {
      if (err) return done(err);
      return done();
    });
  });
  // Pocketmine
  it("Local Find Pocketmine Syncronous", function(done) {
    VersionManeger.find("latest", "pocketmine");
    return done();
  });
  it("Local Find Pocketmine Asyncronous", async function() {
    await VersionManeger.findAsync("latest", "pocketmine");
    return;
  });
  it("Local Find Pocketmine Asyncronous Callback", function(done) {
    VersionManeger.findCallback("latest", "pocketmine", (err, Data) => {
      if (err) return done(err);
      return done();
    });
  });
  // Dragonfly
  it("Local Find Dragonfly Syncronous", function(done) {
    VersionManeger.find("latest", "dragonfly");
    return done();
  });
  it("Local Find Dragonfly Asyncronous", async function() {
    await VersionManeger.findAsync("latest", "dragonfly");
    return;
  });
  it("Local Find Dragonfly Asyncronous Callback", function(done) {
    VersionManeger.findCallback("latest", "dragonfly", (err, Data) => {
      if (err) return done(err);
      return done();
    });
  });
  // Spigot
  it("Local Find Spigot Syncronous", function(done) {
    VersionManeger.find("latest", "spigot");
    return done();
  });
  it("Local Find Spigot Asyncronous", async function() {
    await VersionManeger.findAsync("latest", "spigot");
    return;
  });
  it("Local Find Spigot Asyncronous Callback", function(done) {
    VersionManeger.findCallback("latest", "spigot", (err, Data) => {
      if (err) return done(err);
      return done();
    });
  });
});
describe("Get List", () => {
  it("Local", function(done) {
    VersionManeger.list();
    return done();
  });
  it("Remote async", async function() {
    await VersionManeger.listAsync();
    return;
  });
  it("Remote callback", function(done) {
    VersionManeger.listCallback((err, Data) => {
      if (err) return done(err);
      return done();
    });
  });
});