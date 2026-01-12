import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function NotificationsScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const fontSize = 14;
    const [notifications, setNotifications] = useState([]);

    /* LOAD NOTIFICATIONS */
    useEffect(() => {
        const loadNotifications = async () => {
            const stored = await AsyncStorage.getItem("notifications");
            const list = stored ? JSON.parse(stored) : [];
            setNotifications(list);
        };

        loadNotifications();
    }, []);

    /* MARK AS READ WHEN OPENED */
    useEffect(() => {
        const markAllAsRead = async () => {
            const stored = await AsyncStorage.getItem("notifications");
            if (!stored) return;

            const updated = JSON.parse(stored).map(n => ({
                ...n,
                read: true
            }));

            await AsyncStorage.setItem("notifications", JSON.stringify(updated));
        };

        markAllAsRead();
    }, []);

    return (
        <View style={styles.container}>

            {/* HEADER — SAME AS SETTINGS */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={30} />
                </Pressable>

                <Text style={styles.pageTitle}>
                    {t("notifications.title")}
                </Text>
            </View>

            {/* CONTENT */}
            <ScrollView contentContainerStyle={styles.content}>

                {notifications.length === 0 && (
                    <Text style={styles.emptyText}>
                        {t("notifications.noNotifications")}
                    </Text>
                )}

                {notifications.map(item => (
                    <View key={item.id} style={styles.row}>
                        <Ionicons name="notifications-outline" size={22} />

                        <View style={styles.textBox}>
                            <Text style={[styles.title, { fontSize }]}>
                                {t(item.titleKey)}
                            </Text>

                            <Text style={[styles.message, { fontSize }]}>
                                {t(item.messageKey)}
                            </Text>

                            <Text style={styles.time}>
                                {t(item.timeKey)}
                            </Text>
                        </View>
                    </View>
                ))}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

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
        paddingBottom: 24
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: "#eee"
    },
    textBox: {
        marginLeft: 14,
        flex: 1
    },
    title: {
        fontWeight: "700"
    },
    message: {
        marginTop: 4,
        color: "#444"
    },
    time: {
        fontSize: 12,
        color: "#777",
        marginTop: 6
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#777"
    }
});
