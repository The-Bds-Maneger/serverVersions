global.fetch = (...args) => import("node-fetch").then(m => m.default(...args));
import("node-fetch").then(m => global.fetch = m.default);
async function RAW_TEXT(Host = "https://google.com", ...opts) {
  const FeRes = await fetch(Host, ...opts);
  if (FeRes.ok) return FeRes.text();
  else throw await FeRes.text();
}
module.exports.RAW_TEXT = RAW_TEXT;