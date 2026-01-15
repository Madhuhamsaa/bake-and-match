import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

/* LEVEL 1 DATA */
const EMOJIS = ["🍎", "🍎", "🥛", "🥛", "🍌", "🍌"];

const shuffle = (array) =>
    [...array].sort(() => Math.random() - 0.5);

export default function MemoryEmojiScreen({ level }) {
    const { t } = useTranslation();
    const router = useRouter();

    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [completed, setCompleted] = useState(false);

    /* GET TRANSLATED RESULT MESSAGES (INSIDE COMPONENT ✅) */
    const resultMessages = t("game.resultMessages", {
        returnObjects: true,
    });

    const resultMessage =
        resultMessages[level % resultMessages.length];

    /* INIT GAME */
    useEffect(() => {
        setCards(shuffle(EMOJIS));
    }, []);

    /* CARD PRESS */
    const onCardPress = (index) => {
        if (flipped.length === 2) return;
        if (flipped.includes(index) || matched.includes(index)) return;

        const updated = [...flipped, index];
        setFlipped(updated);

        if (updated.length === 2) {
            const [a, b] = updated;

            if (cards[a] === cards[b]) {
                setMatched((prev) => [...prev, a, b]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 800);
            }
        }
    };

    /* COMPLETION CHECK */
    useEffect(() => {
        if (matched.length === cards.length && cards.length > 0) {
            setTimeout(() => setCompleted(true), 500);
        }
    }, [matched, cards]);

    /* NEXT LEVEL */
    const goNext = async () => {
        const unlocked =
            Number(await AsyncStorage.getItem("levelsUnlocked")) || 1;

        if (level + 1 > unlocked) {
            await AsyncStorage.setItem("levelsUnlocked", String(level + 1));
            await AsyncStorage.setItem("levelsCompleted", String(level));
        }

        setCompleted(false);
        router.replace(`/level/${level + 1}`);
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={30} />
                </Pressable>

                <Text style={styles.pageTitle}>
                    {t("levels.memoryEmoji")}
                </Text>
            </View>

            {/* GAME AREA */}
            <View style={styles.playArea}>
                <View style={styles.gridFrame}>
                    <View style={styles.grid}>
                        {cards.map((emoji, index) => {
                            const isOpen =
                                flipped.includes(index) || matched.includes(index);

                            return (
                                <Pressable
                                    key={index}
                                    style={[
                                        styles.card,
                                        isOpen && styles.cardOpen,
                                    ]}
                                    onPress={() => onCardPress(index)}
                                >
                                    <Text style={styles.cardText}>
                                        {isOpen ? emoji : "❤️"}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* COMPLETION POPUP */}
            <Modal transparent visible={completed} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.popup}>
                        <Text style={styles.popupTitle}>
                            {resultMessage}
                        </Text>

                        <Text style={styles.popupSub}>
                            {t("game.nextLevel")}
                        </Text>

                        <Pressable style={styles.nextBtn} onPress={goNext}>
                            <Text style={styles.nextText}>
                                {t("game.next")}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

/* STYLES */
const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: "center",
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 12,
    },

    playArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    gridFrame: {
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 24,
        padding: 20,
    },

    grid: {
        width: 260,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
    },

    card: {
        width: 72,
        height: 72,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.85)",
        alignItems: "center",
        justifyContent: "center",
    },

    cardOpen: {
        backgroundColor: "#FFD966",
    },

    cardText: {
        fontSize: 34,
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    popup: {
        backgroundColor: "#fff",
        padding: 28,
        borderRadius: 22,
        width: 280,
        alignItems: "center",
    },

    popupTitle: {
        fontSize: 20,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 8,
    },

    popupSub: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
    },

    nextBtn: {
        backgroundColor: "#F4B942",
        paddingVertical: 14,
        paddingHorizontal: 44,
        borderRadius: 30,
    },

    nextText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#3A1A0A",
    },
});
