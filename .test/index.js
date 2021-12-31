const VersionManeger = require("../src/cjs/index");

describe("Find Version", () => {
  it("Local Find Bedrock Syncronous", function(done) {
    const LocalVersion = VersionManeger.find("latest", "bedrock");
    console.log(LocalVersion);
    return done();
  });
  it("Local Find Bedrock Asyncronous", async function() {
    const LocalVersion = await VersionManeger.findAsync("latest", "bedrock");
    console.log(LocalVersion);
    return;
  });
  it("Local Find Bedrock Asyncronous Callback", function(done) {
    VersionManeger.findCallback("latest", "bedrock", (err, Data) => {
      console.log(err, Data);
      if (err) return done(err);
      return done();
    });
  });
});