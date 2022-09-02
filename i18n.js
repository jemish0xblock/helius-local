import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
// import translationEN from "./locales/en/common.json";
// import translationFR from "./locales/fr/common.json";

// const whitelistLang = ["de", "es"];
// const supportedLang = ["en", "fr"];
// const options = {
//   order: ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag", "path", "subdomain"],
//   // lookupQuerystring: "lng",
// };
// the translations
// const resources = {
//   en: {
//     translation: translationEN,
//   },
//   fr: {
//     translation: translationFR,
//   },
// };

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // detection: options,
    // resources,
    // whitelist: supportedLang,
    // lng: "en",
    ns: ["common"],
    defaultNS: "common",
    fallbackLng: "en",
    debug: false,
    localeStructure: "{{lng}}",
    // debug: process.env.NODE_ENV === "development",
    // supportedLngs: supportedLang,
    // otherLanguages: supportedLang,
    // keySeparator: true, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // backend: {
    //   loadPath: `${HOST_NAME}/locales/{{lng}}/{{ns}}.json`,
    // },
    saveMissing: true,
  });
export default i18n;
