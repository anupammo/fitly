import { describe, expect, it } from "vitest";
import { chromeIntentUrl, detectPlatform, isRestrictiveAndroidSkin } from "./pwaInstall";

const UA = {
  chromeRedmi: "Mozilla/5.0 (Linux; Android 13; 23021RAAEG Build/TP1A.220624.014; Redmi Note 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  chromePixel: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  samsung: "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36",
  miBrowser: "Mozilla/5.0 (Linux; U; Android 12; en-in; M2101K6P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.5615.136 Mobile Safari/537.36 XiaoMi/MiuiBrowser/14.4.0",
  whatsappAndroid: "Mozilla/5.0 (Linux; Android 13; RMX3630 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.0.0 Mobile Safari/537.36 WhatsApp/2.24",
  instagram: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 340.0.0",
  iphoneSafari: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  iphoneChrome: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0 Mobile/15E148 Safari/604.1",
  desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
};

describe("install platform detection", () => {
  it.each([
    ["chromeRedmi", "android-chrome"],
    ["chromePixel", "android-chrome"],
    ["samsung", "android-samsung"],
    ["miBrowser", "android-other"],
    ["whatsappAndroid", "in-app"],
    ["instagram", "in-app"],
    ["iphoneSafari", "ios-safari"],
    ["iphoneChrome", "ios-other"],
    ["desktop", "desktop"],
  ] as const)("%s → %s", (key, expected) => {
    expect(detectPlatform(UA[key])).toBe(expected);
  });

  it("flags Android skins that block home screen icons", () => {
    expect(isRestrictiveAndroidSkin(UA.chromeRedmi)).toBe(true);
    expect(isRestrictiveAndroidSkin(UA.whatsappAndroid)).toBe(true); // Realme RMX model
    expect(isRestrictiveAndroidSkin(UA.chromePixel)).toBe(false);
  });

  it("builds a Chrome intent URL with a fallback", () => {
    expect(chromeIntentUrl("https://fitly.example/tracker?x=1")).toBe(
      "intent://fitly.example/tracker?x=1#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https%3A%2F%2Ffitly.example%2Ftracker%3Fx%3D1;end",
    );
  });
});
