import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeMainScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const fontSize = 14;

    return (
        <View style={{ flex: 1 }}>

            {/* HEADER — SAME AS ALL OTHER PAGES */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={30} />
                </Pressable>

                <Text style={styles.pageTitle}>
                    {t("homeMain.title")}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* WELCOME */}
                <Text style={styles.sectionTitle}>
                    {t("homeMain.welcomeTitle")}
                </Text>
                <Text style={[styles.paragraph, { fontSize }]}>
                    {t("homeMain.welcomeText")}
                </Text>

                {/* GAME IDEA */}
                <Text style={styles.sectionTitle}>
                    {t("homeMain.gameIdeaTitle")}
                </Text>
                <Text style={[styles.paragraph, { fontSize }]}>
                    {t("homeMain.gameIdeaText")}
                </Text>

                {/* HOW TO PLAY */}
                <Text style={styles.sectionTitle}>
                    {t("homeMain.howToPlayTitle")}
                </Text>

                <Text style={[styles.paragraph, { fontSize }]}>
                    {t("homeMain.level1")}
                </Text>
                <Text style={[styles.paragraph, { fontSize }]}>
                    {t("homeMain.level2")}
                </Text>
                <Text style={[styles.paragraph, { fontSize }]}>
                    {t("homeMain.level3")}
                </Text>

                {/* TIPS */}
                <Text style={styles.sectionTitle}>
                    {t("homeMain.tipsTitle")}
                </Text>

                <Text style={[styles.paragraph, { fontSize }]}>
                    {t("homeMain.tipsText")}
                </Text>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
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
    content: {
        paddingHorizontal: 20,
        paddingBottom: 30
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 22,
        marginBottom: 8
    },
    paragraph: {
        color: "#555",
        lineHeight: 20,
        marginBottom: 12
    }
});
