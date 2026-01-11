import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ta from "./locales/ta.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        fr: { translation: fr },
        ta: { translation: ta }
    },
    lng: "en",          // default language
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
