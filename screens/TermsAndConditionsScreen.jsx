import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function TermsAndConditionsScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const acceptTerms = async () => {
        await AsyncStorage.setItem("termsAccepted", "true");
        Alert.alert(
            t("terms.acceptedTitle"),
            t("terms.acceptedMessage"),
            [{ text: "OK", onPress: () => router.back() }]
        );
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={30} />
                </Pressable>
                <Text style={styles.title}>{t("terms.title")}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.text}>{t("terms.content")}</Text>
            </ScrollView>

            {/* ACCEPT BUTTON */}
            <Pressable style={styles.button} onPress={acceptTerms}>
                <Text style={styles.buttonText}>{t("terms.acceptButton")}</Text>
            </Pressable>
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
        paddingBottom: 120
    },
    text: {
        fontSize: 15,
        lineHeight: 22
    },
    button: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 12
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center"
    }
});
