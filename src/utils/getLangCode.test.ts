import { describe, it, expect } from "vitest";
import getLangCode from "./getLangCode";

describe("getLangCode", () => {
  it("should return the correct language code for supported languages", () => {
    expect(getLangCode("en")).toBe("en");
    expect(getLangCode("de")).toBe("de");
    expect(getLangCode("de-de")).toBe("de");
    expect(getLangCode("de-DE")).toBe("de");
    expect(getLangCode("de-AT")).toBe("de");
    expect(getLangCode("es")).toBe("es");
    expect(getLangCode("fr")).toBe("fr");
    expect(getLangCode("it")).toBe("it");
    expect(getLangCode("ja")).toBe("ja");
    expect(getLangCode("ko")).toBe("ko");
    expect(getLangCode("ru")).toBe("ru");
  });

  it('should return "en" for unsupported or invalid languages', () => {
    expect(getLangCode("xx")).toBe("en");
    expect(getLangCode("abc")).toBe("en");
    expect(getLangCode("invalid-locale")).toBe("en");
    expect(getLangCode("")).toBe("en");
  });

  it("should handle Chinese language variants correctly", () => {
    expect(getLangCode("zh")).toBe("zh-cn");
    expect(getLangCode("zh-CN")).toBe("zh-cn");
    expect(getLangCode("zh-SG")).toBe("zh-cn");
    expect(getLangCode("zh-TW")).toBe("zh-tw");
    expect(getLangCode("zh-HK")).toBe("zh-tw");
    expect(getLangCode("zh-MO")).toBe("zh-tw");
    expect(getLangCode("zh-Hans")).toBe("zh-cn");
    expect(getLangCode("zh-Hant")).toBe("zh-tw");
  });
});
