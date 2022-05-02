import { fetch as Fetch } from "undici";

export async function fetchBuffer(Host: string, Header?: {[key: string]: string}): Promise<Buffer> {
  let Headers = {...(Header||{})};
  if (/minecraft\.net/.test(Host)) {
    Headers = {
      "accept": "*/*",
      // "accept-language": "pt-BR,pt;q=0.9,en-CA;q=0.8,en;q=0.7,en-US;q=0.6",
      // "cache-control": "no-cache",
      // "pragma": "no-cache",
      // "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
      // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
      // "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
      // "sec-ch-ua-mobile": "?0",
      // "sec-ch-ua-platform": "\"Windows\"",
      // "sec-fetch-dest": "document",
      // "sec-fetch-mode": "navigate",
      // "sec-fetch-site": "none",
      // "sec-fetch-user": "?1",
      // "upgrade-insecure-requests": "1",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
    };
    const Mine = await Fetch("https://minecraft.net/en-us", {
      method: "GET",
      headers: Headers,
    });
    for (const key of Object.keys(Mine.headers)) {
      Headers[key] = Mine.headers[key]||"";
    }
    return await Fetch(Host, {
      method: "GET",
      headers: Headers,
    }).then(async res => Buffer.from(await res.arrayBuffer())).catch(async err => {
       throw new Error(String(err));
    });
  }
  return await Fetch(Host, {
    method: "GET",
    headers: Headers,
  }).then(async res => Buffer.from(await res.arrayBuffer())).catch(async err => {
     throw new Error(String(err));
  });
}

export async function RAW_TEXT(Host: string, Header?: {[key: string]: string}): Promise<string> {
  const AxiosData = await fetchBuffer(Host, Header);
  return String(AxiosData.toString("utf8"));
}

export async function HTML_URLS(Host: string, Header?: {[key: string]: string}) {
  return (await RAW_TEXT(Host, Header||{})).split(/["'<>]/gi).filter(Line => /^.*:\/\//.test(Line.trim()));
}

type githubRelease = {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  tarball_url: string;
  zipball_url: string;
  body: string;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: Array<{
    url: string;
    id: number;
    node_id: string;
    name: string;
    label: string;
    content_type: string;
    state: string;
    size: number;
    download_count: number;
    created_at: string;
    updated_at: string;
    browser_download_url: string;
    uploader: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
    };
  }>;
};
export async function GithubRelease(Repository: string): Promise<Array<githubRelease>> {
  if (!Repository) throw new Error("Repository is required");
  return JSON.parse(await RAW_TEXT(`https://api.github.com/repos/${Repository}/releases?per_page=100`));
}
