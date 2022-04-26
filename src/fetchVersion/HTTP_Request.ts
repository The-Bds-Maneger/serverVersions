import Axios from "axios";

const HeadersBase = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "pt-BR,pt;q=0.9,en-CA;q=0.8,en;q=0.7,en-US;q=0.6",
  "cache-control": "no-cache",
  "pragma": "no-cache",
  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  // "cookie": "MicrosoftApplicationsTelemetryDeviceId=36e285ca-f9b9-4a6d-955d-cceb8cc448b5; MSFPC=GUID=051f4395592a4f2f8df5604340fec093&HASH=051f&LV=202204&V=4&LU=1649512102176; AMCV_EA76ADE95776D2EC7F000101%40AdobeOrg=1585540135%7CMCIDTS%7C19103%7CMCMID%7C48932747922548093303999222545593679983%7CMCAAMLH-1651068831%7C4%7CMCAAMB-1651068831%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C1903426917%7CMCOPTOUT-1650471231s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.0; mbox=session#f45c15e942e340578673db1078eb1530#1650465890|PC#f45c15e942e340578673db1078eb1530.34_0#1684650731; MSGCC=granted; MSCC=cid=d60vpef70hsm19yq3hupsura-c1=2-c2=2-c3=2; _cs_c=0; _CT_RS_=Recording; WRUID=3774769684383387; ApplicationGatewayAffinityCORS=92369c561a94670466dae71ffd2845aa; ApplicationGatewayAffinity=92369c561a94670466dae71ffd2845aa; ak_bmsc=39C348E0C3A2AD01A1787E85987006F1~000000000000000000000000000000~YAAQiwopFwUlZkWAAQAAmNegZg82Kt/TRVjkAZZXAQVyV0ezUo27xamFqkxUJzaSrORtnNFnYlj6ofxCQkyOtTLlwjF/smDQJD6u/EGV7jX3tlB8N7Axr8b2zxoLYMgr79NYShZ12IujWfOOnYYzMFRUrsL2YS3mOC1Uc08mR3l43SomISWnfXTPNUqPXIkmALiX4GNXwqMDu6hXDaYMVRbA7hdScBhzKlBrU6Gb1yPTAgZsKBfi/P8U/Fri6vinLlyMBQoFbUlZcAUc/3fzJF0TdnX+yHtqQ5Gc3D1LbxpwUtnhfGFAKFQ/KZd7Xd+aQ8AKpmabNUYgHltY2oMfwCxNsowOTryX7CQYJhvw9NOo+6TrY54Za5C8OeEZs70hCLZk854KGMKMu5Em; _cs_cvars=%7B%222%22%3A%5B%22user_logged%22%2C%22False%22%5D%7D; AKA_A2=A; bm_sv=058A57200BDC4BA289EB180D69AE351E~GjXunUzmtXWulQeS1yFvUSPT2dJM+F0C+7UqVZesXN9bXDS1O+O0ddxQoA7xHIwb8tZkaFWSWw6AZ9pobYkP4/Q4ftjRSkoK/DoKwMT0Ji2CTht7u/u+euUuRMHSe3gQOXxfsYC+N33zlIJraT0mIM7VAODRaR0iySGmPoQRly0=; ai_session=xsfT1JRrupf5OKy/6HLSVm|1650994502133|1650994745844; _cs_id=a64cbb6f-5e63-af0d-d615-b8bcedc41531.1650039663.6.1650994747.1650994502.1613561419.1684203663316; _cs_s=5.1.0.1650996547024; __CT_Data=gpv=9&ckp=tld&dm=minecraft.net&apv_1067_www32=9&cpv_1067_www32=9&rpv_1067_www32=9; RT=\"z=1&dm=minecraft.net&si=d4381679-2dc9-4037-8016-28006d59a858&ss=l2gfhwfn&sl=5&tt=dva&bcn=%2F%2Fb8a9a27e.akstat.io%2F&ld=5bow&ul=5eg7\""
};

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

export async function fetchBuffer(Host: string, Header?: {[key: string]: string}): Promise<Buffer> {
  const Headers = {...HeadersBase, ...(Header||{})};
  const Response = await Axios.get(Host, {headers: Headers, responseEncoding: "binary", responseType: "arraybuffer"});
  return Buffer.from(Response.data);
}

export async function RAW_TEXT(Host: string, Header?: {[key: string]: string}): Promise<string> {
  const AxiosData = await fetchBuffer(Host, Header);
  return String(AxiosData.toString("utf8"));
}

export async function HTML_URLS(Host: string, Header?: {[key: string]: string}) {
  return (await RAW_TEXT(Host, Header||{})).split(/["'<>]/gi).filter(Line => /^.*:\/\//.test(Line.trim()));
}

export async function GithubRelease(Repository: string): Promise<Array<githubRelease>> {
  if (!Repository) throw new Error("Repository is required");
  return JSON.parse(await RAW_TEXT(`https://api.github.com/repos/${Repository}/releases?per_page=100`));
}
