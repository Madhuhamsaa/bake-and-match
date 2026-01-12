import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Text as SvgText, TextPath } from "react-native-svg";

export default function HomeScreen() {
    const router = useRouter();
    const APP_VERSION = "1.0.0"; // change to 1.0.1 later

    // TEMP font size (later this will come from Settings / context)
    const fontSize = 16;

    const { t } = useTranslation();

    const handleExitApp = () => {
        Alert.alert(
            t("exit.title"),
            t("exit.message"),
            [
                {
                    text: t("exit.no"),
                    style: "cancel"
                },
                {
                    text: t("exit.yes"),
                    style: "destructive",
                    onPress: () => BackHandler.exitApp()
                }
            ]
        );
    };

    const [unreadCount, setUnreadCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const loadUnreadCount = async () => {
                const stored = await AsyncStorage.getItem("notifications");
                const notifications = stored ? JSON.parse(stored) : [];

                const unread = notifications.filter(n => !n.read).length;
                setUnreadCount(unread);
            };

            loadUnreadCount();
        }, [])
    );

    return (

        <View style={styles.container}>

            {/* CENTER */}
            <View style={styles.center}>
                {/* CURVED TITLE */}
                <Svg width={300} height={140}>
                    <Path
                        id="curve"
                        d="M 30 100 Q 150 20 270 100"
                        fill="transparent"
                    />
                    <SvgText
                        fill="#000000ff"
                        fontSize="36"
                        fontWeight="1000"
                        letterSpacing="0"
                    >
                        <TextPath href="#curve" startOffset="1%" textAnchor="middle">
                            BAKE & MATCH
                        </TextPath>
                    </SvgText>
                </Svg>

                {/* POT */}
                <View style={styles.potBox}>
                    <Text style={styles.pot}>🍲</Text>
                </View>

                {/* TAGLINE */}
                <Text style={[styles.tagline, { fontSize }]}>
                    Think. Cook. Match.
                </Text>

                {/* START BUTTON */}
                <Pressable style={styles.startButton}>
                    <Text style={[styles.startText, { fontSize: fontSize + 2 }]}>
                        START
                    </Text>
                </Pressable>
            </View>

            {/* BOTTOM BAR – ICON BUTTONS */}
            <View style={styles.bottomBar}>
                <Pressable
                    style={styles.bottomBox}
                    onPress={() => router.push("/home-main")}
                >
                    <Ionicons name="home-outline" size={30} />
                </Pressable>

                <Pressable
                    style={styles.bottomBox}
                    onPress={() => router.push("/notifications")}
                >
                    <Ionicons name="notifications-outline" size={30} />

                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </Pressable>

                <Pressable
                    style={styles.bottomBox}
                    onPress={() => router.push("/profile")}
                >
                    <Ionicons name="person-outline" size={30} color="#000000ff" />
                </Pressable>

                {/* SETTINGS – CONNECTED */}
                <Pressable
                    style={styles.bottomBox}
                    onPress={() => router.push("/settings")}
                >
                    <Ionicons name="settings-outline" size={30} color="#000000ff" />
                </Pressable>

                <Pressable
                    style={styles.bottomBox}
                    onPress={handleExitApp}
                >
                    <Ionicons
                        name="close-circle-outline"
                        size={30}
                        color="#000000ff"
                    />
                </Pressable>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, justifyContent: "space-between" },
    badge: {
        position: "absolute",
        top: 6,
        right: 14,
        backgroundColor: "red",
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: "center",
        justifyContent: "center"
    },
    badgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700"
    },

    /* CENTER */
    center: { alignItems: "center", marginTop: 100 },

    potBox: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 100, marginTop: -20, marginBottom: 40, padding: 50 },
    pot: { fontSize: 110 },
    tagline: { color: "#ffffffff", marginBottom: 40, letterSpacing: 0.5 },

    startButton: { backgroundColor: "#F4B942", paddingVertical: 16, paddingHorizontal: 70, borderRadius: 40, elevation: 6 },
    startText: { fontWeight: "700", color: "#3A1A0A" },

    /* BOTTOM BAR */
    bottomBar: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 30, paddingBottom: 20 },
    bottomBox: { flex: 1, marginHorizontal: 6, backgroundColor: "rgba(0,0,0,0.25)", paddingVertical: 14, borderRadius: 16, alignItems: "center" }
});
