import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { chooseLocale } from "./locale";
// No external geolocation service, GPS permission or IP storage is needed.
export const detectLocale = createServerFn({ method: "GET" }).handler(() => {
  const headers = getRequest().headers;
  const country = headers.get("cf-ipcountry") || headers.get("x-vercel-ip-country");
  return { locale: chooseLocale(country, headers.get("accept-language") || ""), countryKnown: country === "FR" || country === "DE" };
});
