const Axios = require("axios");
async function RAW_TEXT(Host = "https://google.com", ...opts) {
  const { data } = await Axios.get(Host, ...opts);
  return data;
}
module.exports.RAW_TEXT = RAW_TEXT;