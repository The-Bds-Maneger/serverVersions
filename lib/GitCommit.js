const fs = require("fs");
const path = require("path");

let TextBody = [];

function AddText(text) {
  TextBody.push(text);
}

module.exports = {
  writeText: () => {
    TextBody.push("", "- By Github Actions");
    fs.writeFileSync(path.resolve(__dirname, "../GitMessage.txt"), TextBody.join("\n"));
    TextBody = [];
  },
  AddText: AddText
};
