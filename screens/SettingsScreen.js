import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import i18n from "../i18n";

export default function SettingsScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const [currentLang, setCurrentLang] = useState(i18n.language);

    const [music, setMusic] = useState(true);
    const [sound, setSound] = useState(true);
    const [fontSize, setFontSize] = useState(14);

    useEffect(() => {
        const onLanguageChange = (lng) => {
            setCurrentLang(lng);
        };

        i18n.on("languageChanged", onLanguageChange);

        return () => {
            i18n.off("languageChanged", onLanguageChange);
        };
    }, []);

    const handleReset = () => {
        Alert.alert(
            t("settings.resetTitle"),
            t("settings.resetMessage"),
            [
                { text: t("common.cancel"), style: "cancel" },
                {
                    text: t("common.confirm"),
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.clear();
                        Alert.alert(t("settings.resetDone"));
                    }
                }
            ]
        );
    };


    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={30} />
                </Pressable>

                <Text style={styles.pageTitle}>
                    {t("settings.title")}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* AUDIO */}
                <Text style={[styles.section, { fontSize }]}>
                    {t("settings.audio")}
                </Text>

                <View style={[styles.row, styles.compactRow]}>
                    <Text style={[styles.label, { fontSize }]}>
                        {t("settings.music")}
                    </Text>
                    <Switch value={music} onValueChange={setMusic} />
                </View>

                <View style={[styles.row, styles.compactRow]}>
                    <Text style={[styles.label, { fontSize }]}>
                        {t("settings.soundEffects")}
                    </Text>
                    <Switch value={sound} onValueChange={setSound} />
                </View>

                {/* LANGUAGE */}
                <Text style={[styles.section, { fontSize }]}>
                    {t("settings.language")}
                </Text>

                <Pressable
                    style={styles.row}
                    onPress={() => i18n.changeLanguage("en")}
                >
                    <Text
                        style={[
                            styles.label,
                            styles.clickableText,
                            { fontSize },
                            currentLang === "en" && styles.activeText
                        ]}
                    >
                        English
                    </Text>

                    <Ionicons
                        name={currentLang === "en" ? "checkmark" : "chevron-forward-outline"}
                        size={20}
                        color={currentLang === "en" ? "#000" : "#999"}
                    />
                </Pressable>

                <Pressable
                    style={styles.row}
                    onPress={() => i18n.changeLanguage("fr")}
                >
                    <Text
                        style={[
                            styles.label,
                            styles.clickableText,
                            { fontSize },
                            currentLang === "fr" && styles.activeText
                        ]}
                    >
                        Français
                    </Text>

                    <Ionicons
                        name={currentLang === "fr" ? "checkmark" : "chevron-forward-outline"}
                        size={20}
                        color={currentLang === "fr" ? "#000" : "#999"}
                    />
                </Pressable>

                <Pressable
                    style={styles.row}
                    onPress={() => i18n.changeLanguage("ta")}
                >
                    <Text
                        style={[
                            styles.label,
                            styles.clickableText,
                            { fontSize },
                            currentLang === "ta" && styles.activeText
                        ]}
                    >
                        தமிழ்
                    </Text>

                    <Ionicons
                        name={currentLang === "ta" ? "checkmark" : "chevron-forward-outline"}
                        size={20}
                        color={currentLang === "ta" ? "#000" : "#999"}
                    />
                </Pressable>

                {/* FONT SIZE */}
                <Text style={[styles.section, { fontSize }]}>
                    {t("settings.fontSize")}
                </Text>

                <View style={styles.row}>
                    <Pressable onPress={() => setFontSize(fontSize - 1)}>
                        <Text style={styles.control}>−</Text>
                    </Pressable>

                    <Text style={[styles.label, { fontSize }]}>
                        {fontSize}
                    </Text>

                    <Pressable onPress={() => setFontSize(fontSize + 1)}>
                        <Text style={styles.control}>+</Text>
                    </Pressable>
                </View>

                {/* INFO */}
                <Text style={[styles.section, { fontSize }]}>
                    {t("settings.information")}
                </Text>

                <Pressable style={styles.row} onPress={() => router.push("/terms")}>
                    <Text style={[styles.label, styles.clickableText, { fontSize }]}>
                        {t("settings.terms")}
                    </Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ffffffff" />
                </Pressable>

                <Pressable style={styles.row} onPress={() => router.push("/privacy")}>
                    <Text style={[styles.label, styles.clickableText, { fontSize }]}>
                        {t("settings.privacy")}
                    </Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ffffffff" />
                </Pressable>

                {/* DATA */}
                <Text style={[styles.section, { fontSize }]}>
                    {t("settings.data")}
                </Text>

                <Pressable
                    style={[styles.row, styles.danger]}
                    onPress={handleReset}
                >
                    <Text style={[styles.label, { fontSize, color: "red" }]}>
                        {t("settings.resetData")}
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 50,        // pushes content down
        paddingBottom: 16,
        paddingHorizontal: 20
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: "center"
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 12
    },
    clickableText: {
        color: "#222"
    },
    activeText: {
        fontWeight: "700"
    },
    content: { paddingHorizontal: 20, paddingBottom: 24 },
    section: {
        fontWeight: "600",
        fontSize: 18,
        marginTop: 20,
        marginBottom: 8
    },
    row: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2
    },
    compactRow: {
        marginTop: 2,
        marginBottom: -6
    },
    languageRow: {
        paddingVertical: 8
    },
    label: {},
    control: { fontSize: 22, paddingHorizontal: 12 },
    danger: { borderWidth: 1, borderColor: "#FFDADA" }
});
