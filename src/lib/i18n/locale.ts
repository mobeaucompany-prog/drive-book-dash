export type Locale = "fr" | "de";
export function chooseLocale(country?: string | null, languages = ""): Locale {
  if (country?.toUpperCase() === "DE") return "de";
  if (country?.toUpperCase() === "FR") return "fr";
  // Respect language quality weights, including an explicit q=0 exclusion.
  const supported = languages.split(",").map((entry, index) => {
    const [tag, ...params] = entry.trim().toLowerCase().split(";");
    const weight = params.find(p => p.trim().startsWith("q="));
    return { language: tag.split("-")[0], q: weight ? Number(weight.trim().slice(2)) : 1, index };
  }).filter(x => (x.language === "fr" || x.language === "de") && x.q > 0 && x.q <= 1)
    .sort((a,b) => b.q - a.q || a.index - b.index);
  return supported[0]?.language === "de" ? "de" : "fr";
}
