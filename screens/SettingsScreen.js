import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import i18n from "../i18n";

export default function SettingsScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const [music, setMusic] = useState(true);
    const [sound, setSound] = useState(true);
    const [fontSize, setFontSize] = useState(14);

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
                    <Text style={[styles.label, { fontSize }]}>English</Text>
                </Pressable>

                <Pressable
                    style={[styles.row, styles.languageRow]}
                    onPress={() => i18n.changeLanguage("fr")}
                >
                    <Text style={[styles.label, { fontSize }]}>Français</Text>
                </Pressable>

                <Pressable
                    style={[styles.row, styles.languageRow]}
                    onPress={() => i18n.changeLanguage("ta")}
                >
                    <Text style={[styles.label, { fontSize }]}>தமிழ்</Text>
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

                <Pressable style={styles.row}>
                    <Text style={[styles.label, { fontSize }]}>
                        {t("settings.terms")}
                    </Text>
                </Pressable>

                <Pressable style={styles.row}>
                    <Text style={[styles.label, { fontSize }]}>
                        {t("settings.privacy")}
                    </Text>
                </Pressable>

                {/* ACCOUNT */}
                <Text style={[styles.section, { fontSize }]}>
                    {t("settings.account")}
                </Text>

                <Pressable style={[styles.row, styles.danger]}>
                    <Text style={[styles.label, { fontSize, color: "red" }]}>
                        {t("settings.deleteAccount")}
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
