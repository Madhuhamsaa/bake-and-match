import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicyScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={30} />
                </Pressable>
                <Text style={styles.title}>{t("privacy.title")}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.text}>{t("privacy.content")}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        textAlign: "center",
        marginVertical: 16
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    text: {
        fontSize: 15,
        lineHeight: 22
    }
});
