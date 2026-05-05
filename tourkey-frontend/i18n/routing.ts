import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en", "de", "ru", "fr", "es", "nl", "el", "ar", "it"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
});
