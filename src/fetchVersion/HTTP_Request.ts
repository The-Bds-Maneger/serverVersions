import Axios from "axios";
import child_process from "child_process";

export async function fetchBuffer(Host: string, Header?: {[key: string]: string}): Promise<Buffer> {
  let Headers = {...(Header||{})};
  return await Axios.get(Host, {
    headers: Headers,
    responseEncoding: "binary",
    responseType: "arraybuffer"
  }).then(async res => Buffer.from(res.data));
}

const minecraftUrlsRegex = /http(s)?:\/\/(.*)?minecraft\.net/;
export async function RAW_TEXT(Host: string, Header?: {[key: string]: string}): Promise<string> {
  if (minecraftUrlsRegex.test(Host)) {
    const curlData = child_process.execFileSync("curl", ["-s", "-L", "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36", Host], {stdio: "pipe"}).toString("utf8");
    return curlData;
  }
  const Data = await fetchBuffer(Host, Header);
  return String(Data.toString("utf8"));
}

export async function getJson(Host: string, Header?: {[key: string]: string}): Promise<any> {
  const Data = await fetchBuffer(Host, Header);
  return JSON.parse(Data.toString("utf8"));
}

export async function HTML_URLS(Host: string, Header?: {[key: string]: string}) {
  return (await RAW_TEXT(Host, Header)).split(/["'<>]/gi).filter(Line => /^.*:\/\//.test(Line.trim()));
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
