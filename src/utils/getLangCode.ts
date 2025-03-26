function getLangCode(input: string): string {
  const supported = new Set([
    "en",
    "de",
    "es",
    "fr",
    "it",
    "ja",
    "ko",
    "ru",
    "zh-cn",
    "zh-tw",
  ]);

  try {
    let locale: Intl.Locale;
    try {
      locale = new Intl.Locale(input);
    } catch {
      // Handle invalid locale format
      return "en";
    }

    // Attempt to maximize the locale to get the most specific information
    locale = locale.maximize();

    const baseLang = locale.language.toLowerCase();

    // Handle non-Chinese supported languages
    if (supported.has(baseLang)) {
      return baseLang;
    }

    // Handle Chinese variants
    if (baseLang === "zh") {
      const region = (locale.region || "").toUpperCase();
      const script = (locale.script || "").toLowerCase();

      // Region-based matching
      if (["CN", "SG"].includes(region)) return "zh-cn";
      if (["TW", "HK", "MO"].includes(region)) return "zh-tw";

      // Script-based matching
      if (script === "hans") return "zh-cn";
      if (script === "hant") return "zh-tw";

      // Default for Chinese (Simplified Chinese)
      return "zh-cn";
    }
  } catch (e) {
    // Fall through to default return
  }

  return "en";
}

export default getLangCode;
