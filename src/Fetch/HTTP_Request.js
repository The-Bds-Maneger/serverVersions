const Axios = require("axios");

const HeadersBase = {
  // "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "pt-BR,pt;q=0.9,en-CA;q=0.8,en;q=0.7,en-US;q=0.6",
  "cache-control": "no-cache",
  "pragma": "no-cache",
  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1"
};

const GithubReleaseExample = [
  {
    "url": "https://api.github.com/repos/The-Bds-Maneger/Dragonfly_Build/releases/51942140",
    "assets_url": "https://api.github.com/repos/The-Bds-Maneger/Dragonfly_Build/releases/51942140/assets",
    "upload_url": "https://uploads.github.com/repos/The-Bds-Maneger/Dragonfly_Build/releases/51942140/assets{?name,label}",
    "html_url": "https://github.com/The-Bds-Maneger/Dragonfly_Build/releases/tag/1.17.40",
    "id": 51942140,
    "author": {
      "login": "github-actions[bot]",
      "id": 41898282,
      "node_id": "MDM6Qm90NDE4OTgyODI=",
      "avatar_url": "https://avatars.githubusercontent.com/in/15368?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/github-actions%5Bbot%5D",
      "html_url": "https://github.com/apps/github-actions",
      "followers_url": "https://api.github.com/users/github-actions%5Bbot%5D/followers",
      "following_url": "https://api.github.com/users/github-actions%5Bbot%5D/following{/other_user}",
      "gists_url": "https://api.github.com/users/github-actions%5Bbot%5D/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/github-actions%5Bbot%5D/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/github-actions%5Bbot%5D/subscriptions",
      "organizations_url": "https://api.github.com/users/github-actions%5Bbot%5D/orgs",
      "repos_url": "https://api.github.com/users/github-actions%5Bbot%5D/repos",
      "events_url": "https://api.github.com/users/github-actions%5Bbot%5D/events{/privacy}",
      "received_events_url": "https://api.github.com/users/github-actions%5Bbot%5D/received_events",
      "type": "Bot",
      "site_admin": false
    },
    "node_id": "RE_kwDOGG0V_c4DGJL8",
    "tag_name": "1.17.40",
    "target_commitish": "main",
    "name": "Dragonfly Minecraft Bedrock 1.17.40",
    "draft": false,
    "prerelease": false,
    "created_at": "2021-09-28T11:07:24Z",
    "published_at": "2021-10-25T00:20:28Z",
    "assets": [
      {
        "url": "https://api.github.com/repos/The-Bds-Maneger/Dragonfly_Build/releases/assets/47782389",
        "id": 47782389,
        "node_id": "RA_kwDOGG0V_c4C2Rn1",
        "name": "Dragonfly_android_amd64",
        "label": "",
        "uploader": {
          "login": "github-actions[bot]",
          "id": 41898282,
          "node_id": "MDM6Qm90NDE4OTgyODI=",
          "avatar_url": "https://avatars.githubusercontent.com/in/15368?v=4",
          "gravatar_id": "",
          "url": "https://api.github.com/users/github-actions%5Bbot%5D",
          "html_url": "https://github.com/apps/github-actions",
          "followers_url": "https://api.github.com/users/github-actions%5Bbot%5D/followers",
          "following_url": "https://api.github.com/users/github-actions%5Bbot%5D/following{/other_user}",
          "gists_url": "https://api.github.com/users/github-actions%5Bbot%5D/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/github-actions%5Bbot%5D/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/github-actions%5Bbot%5D/subscriptions",
          "organizations_url": "https://api.github.com/users/github-actions%5Bbot%5D/orgs",
          "repos_url": "https://api.github.com/users/github-actions%5Bbot%5D/repos",
          "events_url": "https://api.github.com/users/github-actions%5Bbot%5D/events{/privacy}",
          "received_events_url": "https://api.github.com/users/github-actions%5Bbot%5D/received_events",
          "type": "Bot",
          "site_admin": false
        },
        "content_type": "application/octet-stream",
        "state": "uploaded",
        "size": 17296984,
        "download_count": 1,
        "created_at": "2021-10-25T00:21:53Z",
        "updated_at": "2021-10-25T00:21:55Z",
        "browser_download_url": "https://github.com/The-Bds-Maneger/Dragonfly_Build/releases/download/1.17.40/Dragonfly_android_amd64"
      }
    ],
    "tarball_url": "https://api.github.com/repos/The-Bds-Maneger/Dragonfly_Build/tarball/1.17.40",
    "zipball_url": "https://api.github.com/repos/The-Bds-Maneger/Dragonfly_Build/zipball/1.17.40",
    "body": ""
  }
];

module.exports.GithubRelease = async function GithubRelease(Repository = "") {
  if (!Repository) throw new Error("Repository is required");
  let Data = GithubReleaseExample;
  Data = (await Axios.get(`https://api.github.com/repos/${Repository}/releases?per_page=100`)).data;
  return Data;
}

module.exports.RAW_TEXT = async function RAW_TEXT(Host = "https://google.com", Header = {}) {
  const AxiosData = await Axios.get(Host, {
    headers: {
      ...HeadersBase,
      ...Header
    }
  });
  return String(AxiosData.data);
}

module.exports.HTML_URLS = async function URLS(Host = "https://google.com", Header = {}) {
  const data = String((await Axios.get(Host, {
    headers: {
      ...HeadersBase,
      ...Header
    }
  })).data);
  const Ls = data.split(/["'<>]/gi).filter(d=>/^.*:\/\//.test(d.trim()));
  return Ls;
}