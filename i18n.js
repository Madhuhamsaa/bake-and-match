import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ta from "./locales/ta.json";

const LANGUAGE_KEY = "appLanguage";

const languageDetector = {
    type: "languageDetector",
    async: true,
    detect: async (callback) => {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        callback(savedLanguage || "en");
    },
    init: () => { },
    cacheUserLanguage: async (lng) => {
        await AsyncStorage.setItem(LANGUAGE_KEY, lng);
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        compatibilityJSON: "v3",
        resources: {
            en: { translation: en },
            fr: { translation: fr },
            ta: { translation: ta },
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
