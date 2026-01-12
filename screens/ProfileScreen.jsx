import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import i18n from "../i18n";

export default function ProfileScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [playerId, setPlayerId] = useState("");
    const [avatarUri, setAvatarUri] = useState(null);
    const [playerName, setPlayerName] = useState("Player");
    const [editing, setEditing] = useState(false);

    const saveName = async () => {
        await AsyncStorage.setItem("playerName", playerName);
        setEditing(false);

        Alert.alert(
            t("profile.nameUpdatedTitle"),
            t("profile.nameUpdatedMessage")
        );
    };

    const chooseAvatarSource = () => {
        Alert.alert(
            t("profile.avatarTitle"),
            t("profile.avatarSubtitle"),
            [
                { text: t("profile.useCamera"), onPress: openCamera },
                { text: t("profile.useGallery"), onPress: openGallery },
                { text: t("common.cancel"), style: "cancel" }
            ]
        );
    };

    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8
        });

        if (!result.canceled) {
            saveAvatar(result.assets[0].uri);
        }
    };

    const openGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8
        });

        if (!result.canceled) {
            saveAvatar(result.assets[0].uri);
        }
    };

    const saveAvatar = async (uri) => {
        await AsyncStorage.setItem("avatarUri", uri);
        setAvatarUri(uri);

        Alert.alert(
            t("profile.avatarSetTitle"),
            t("profile.avatarSetMessage")
        );
    };

    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const loadAchievements = async () => {
            const stored = await AsyncStorage.getItem("achievements");
            setAchievements(stored ? JSON.parse(stored) : []);
        };

        loadAchievements();
    }, []);


    const updateAchievements = async (newCompleted) => {
        const stored = await AsyncStorage.getItem("achievements");
        const achievements = stored ? JSON.parse(stored) : [];

        const unlock = (key) => {
            if (!achievements.includes(key)) achievements.push(key);
        };

        if (newCompleted >= 1) unlock("first_level");
        if (newCompleted >= 5) unlock("five_levels");
        if (newCompleted >= 10) unlock("ten_levels");

        await AsyncStorage.setItem("achievements", JSON.stringify(achievements));
    };

    // Temporary / local values (can be replaced later)
    const [progress, setProgress] = useState({
        unlocked: 1,
        total: 20,
        completed: 0,
        difficulty: "Easy"
    });

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setAvatarUri(uri);
            await AsyncStorage.setItem("avatarUri", uri);
        }
    };

    useEffect(() => {
        const loadName = async () => {
            const saved = await AsyncStorage.getItem("playerName");
            if (saved) setPlayerName(saved);
        };
        loadName();
    }, []);

    useEffect(() => {
        const loadAvatar = async () => {
            const savedAvatar = await AsyncStorage.getItem("avatarUri");
            if (savedAvatar) {
                setAvatarUri(savedAvatar);
            }
        };
        loadAvatar();
    }, []);

    useEffect(() => {
        const loadOrCreatePlayerId = async () => {
            const storedId = await AsyncStorage.getItem("playerId");
            if (storedId) {
                setPlayerId(storedId);
            } else {
                const newId =
                    "BM-" +
                    Math.random().toString(36).substring(2, 8).toUpperCase();
                await AsyncStorage.setItem("playerId", newId);
                setPlayerId(newId);
            }
        };

        loadOrCreatePlayerId();
    }, []);

    useEffect(() => {
        const loadProgress = async () => {
            const completed = Number(await AsyncStorage.getItem("levelsCompleted")) || 0;
            const unlocked = Number(await AsyncStorage.getItem("levelsUnlocked")) || 1;
            const difficulty =
                (await AsyncStorage.getItem("difficulty")) || "Easy";

            setProgress({
                unlocked,
                total: 20,
                completed,
                difficulty
            });
        };

        loadProgress();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={28} />
                </Pressable>
                <Text style={styles.pageTitle}>{t("profile.title")}</Text>
            </View>

            {/* SCROLLABLE CONTENT */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* PROFILE HEADER */}
                <View style={styles.profileHeader}>
                    <Pressable onPress={chooseAvatarSource} style={styles.avatarWrapper}>
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="camera-outline" size={34} color="#777" />
                            </View>
                        )}
                    </Pressable>

                    <Text style={styles.avatarHint}>
                        {t("profile.avatarHint")}
                    </Text>
                    {editing ? (
                        <TextInput
                            value={playerName}
                            onChangeText={setPlayerName}
                            onBlur={saveName}
                            style={styles.nameInput}
                            autoFocus
                        />
                    ) : (
                        <Pressable onPress={() => setEditing(true)}>
                            <Text style={styles.playerName}>
                                {playerName} ✏️
                            </Text>
                        </Pressable>
                    )}

                    <Text style={styles.subText}>{t("profile.localProfile")}</Text>
                    <Text style={styles.subText}>
                        {t("profile.playerId")}: {playerId}
                    </Text>
                </View>

                {/* PROGRESS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t("profile.progress")}</Text>

                    <View style={styles.sectionContent}>
                        <Text style={styles.item}>
                            {t("profile.levelsUnlocked")}: {progress.unlocked}/{progress.total}
                        </Text>
                        <Text style={styles.item}>
                            {t("profile.levelsCompleted")}: {progress.completed}
                        </Text>
                        <Text style={styles.item}>
                            {t("profile.difficulty")}: {progress.difficulty}
                        </Text>
                    </View>
                </View>


                {/* ACHIEVEMENTS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t("profile.achievements")}</Text>

                    <View style={styles.sectionContent}>
                        <Text style={styles.item}>
                            {achievements.includes("first_level") ? "🏅" : "🔒"} {t("profile.achFirst")}
                        </Text>
                        <Text style={styles.item}>
                            {achievements.includes("five_levels") ? "🏅" : "🔒"} {t("profile.achFive")}
                        </Text>
                        <Text style={styles.item}>
                            {achievements.includes("ten_levels") ? "🏅" : "🔒"} {t("profile.achTen")}
                        </Text>
                    </View>
                </View>


                {/* PREFERENCES */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t("profile.preferences")}</Text>
                    <Text style={styles.item}>
                        {t("profile.language")}: {i18n.language.toUpperCase()}
                    </Text>
                    <Text style={styles.item}>
                        {t("profile.sound")}: ON
                    </Text>
                    <Text style={styles.item}>
                        {t("profile.music")}: ON
                    </Text>
                </View>

                {/* SPACE FOR FOOTER */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* FOOTER (FIXED AT BOTTOM) */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Bake and Match</Text>
                <Text style={styles.footerText}>Version 1.0.0</Text>
                <Text style={styles.footerDescription}>
                    {t("profile.aboutDescription")}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20
    },
    nameInput: {
        fontSize: 22,
        fontWeight: "700",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        textAlign: "center"
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: "center"
    },
    pageTitle: {
        fontSize: 26,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 8
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    profileHeader: {
        alignItems: "center",
        marginBottom: 24
    },
    playerName: {
        fontSize: 22,
        fontWeight: "700",
        marginTop: 8
    },
    subText: {
        fontSize: 13,
        color: "#666",
        textAlign: "center",
        marginTop: 4
    },
    section: {
        marginTop: 24
    },
    sectionContent: {
        paddingLeft: 1,
        marginTop: 10
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8
    },
    item: {
        fontSize: 15,
        marginBottom: 12,
        marginLeft: 26,
        lineHeight: 22,
        marginTop: 10
    },
    avatarWrapper: {
        marginBottom: 8
    },
    avatarPlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center"
    },
    avatarImage: {
        width: 96,
        height: 96,
        borderRadius: 48
    },
    avatarHint: {
        fontSize: 12,
        color: "#777",
        marginTop: 4
    },
    footer: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderColor: "#eee",
        alignItems: "center"
    },
    footerText: {
        fontSize: 12,
        color: "#777"
    },
    footerDescription: {
        fontSize: 12,
        color: "#777",
        textAlign: "center",
        marginTop: 4
    }
});
