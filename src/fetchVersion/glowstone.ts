import { getJson } from "../lib/HTTP_Request";

export const getFiles: () => Promise<{url: String, repo: String, date: Date}[]> = () => getJson("https://repo.glowstone.net/service/rest/v1/search/assets?group=net.glowstone&name=glowstone").then(data => {
  return data?.items?.filter(a => /\.jar$/.test(a.downloadUrl) && a.maven2?.classifier === undefined)?.map(data => ({url: data.downloadUrl, repo: data.repository, date: new Date(data.lastModified)}));
});