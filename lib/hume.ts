import { fetchAccessToken } from "hume";

export const getHumeAccessToken = async () => {
  const accessToken = await fetchAccessToken({
    apiKey: process.env.HUME_API_KEY || '',
    secretKey: process.env.HUME_SECRET_KEY || '',
  });

  return accessToken && accessToken !== "undefined" ? accessToken : null;
};
