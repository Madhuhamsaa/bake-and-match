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

/* INGREDIENT CONFIG (LANGUAGE-INDEPENDENT KEYS) */
const INGREDIENTS = [
    { key: "milk", correct: true },
    { key: "sugar", correct: true },
    { key: "flour", correct: true },
    { key: "water", correct: true },

    { key: "slime", correct: false },
    { key: "wine", correct: false },
    { key: "yeast", correct: false },
    { key: "yogurt", correct: false },
    { key: "juice", correct: false },
];

/* SHUFFLE HELPER */
const shuffle = (array) =>
    [...array].sort(() => Math.random() - 0.5);

export default function BakingStepOneScreen({ level }) {
    const { t } = useTranslation();
    const router = useRouter();

    const REQUIRED = 4;

    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState([]);
    const [failed, setFailed] = useState(false);
    const [success, setSuccess] = useState(false);

    /* SHUFFLE INGREDIENTS ON LOAD */
    useEffect(() => {
        setItems(shuffle(INGREDIENTS));
    }, []);

    /* INGREDIENT SELECT */
    const onSelect = (item) => {
        if (selected.includes(item.key)) return;

        if (!item.correct) {
            setFailed(true);
            return;
        }

        const updated = [...selected, item.key];
        setSelected(updated);

        if (updated.length === REQUIRED) {
            setSuccess(true);
        }
    };

    /* RESTART SAME LEVEL */
    const restart = () => {
        setFailed(false);
        setSelected([]);
        setItems(shuffle(INGREDIENTS));
        router.replace(`/level/${level}`);
    };

    /* GO NEXT LEVEL */
    const goNext = async () => {
        await AsyncStorage.setItem("levelsUnlocked", String(level + 1));
        await AsyncStorage.setItem("levelsCompleted", String(level));
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
                    {t("baking.step1Title")}
                </Text>
            </View>

            {/* CENTER CONTENT */}
            <View style={styles.centerArea}>
                {/* INSTRUCTION */}
                <Text style={styles.instruction}>
                    {t("baking.step1Instruction")}
                </Text>

                {/* INGREDIENT GRID */}
                <View style={styles.grid}>
                    {items.map((item) => (
                        <Pressable
                            key={item.key}
                            style={[
                                styles.card,
                                selected.includes(item.key) && styles.cardSelected,
                            ]}
                            onPress={() => onSelect(item)}
                        >
                            <Text style={styles.cardText}>
                                {t(`ingredients.${item.key}`)}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* PICK COUNT — BELOW BLOCKS */}
                <Text style={styles.pickHint}>
                    {t("baking.pickCount", { count: REQUIRED })}
                </Text>
            </View>

            {/* FAIL POPUP */}
            <Modal transparent visible={failed}>
                <View style={styles.overlay}>
                    <View style={styles.popup}>
                        <Text style={styles.popupTitle}>
                            {t("baking.fail")}
                        </Text>

                        <Pressable style={styles.btn} onPress={restart}>
                            <Text style={styles.btnText}>
                                {t("baking.tryAgain")}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* SUCCESS POPUP */}
            <Modal transparent visible={success}>
                <View style={styles.overlay}>
                    <View style={styles.popup}>
                        <Text style={styles.popupTitle}>
                            {t("baking.successEasy")}
                        </Text>

                        <Pressable style={styles.btn} onPress={goNext}>
                            <Text style={styles.btnText}>
                                {t("baking.continue")}
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
    container: {
        flex: 1,
    },

    header: {
        paddingTop: 50,
        paddingBottom: 10,
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

    /* CENTER EVERYTHING VERTICALLY */
    centerArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    instruction: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginTop: -80,   // space ABOVE blocks
        marginBottom: 60,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
        marginBottom: 60,   // space BELOW blocks
    },

    card: {
        width: 100,
        height: 52,
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    cardSelected: {
        backgroundColor: "#FFD966",
    },

    cardText: {
        fontSize: 16,
        fontWeight: "600",
    },

    pickHint: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        color: "#333",
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    popup: {
        backgroundColor: "#fff",
        padding: 26,
        borderRadius: 22,
        width: 280,
        alignItems: "center",
    },

    popupTitle: {
        fontSize: 18,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 16,
    },

    btn: {
        backgroundColor: "#F4B942",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
    },

    btnText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#3A1A0A",
    },
});
