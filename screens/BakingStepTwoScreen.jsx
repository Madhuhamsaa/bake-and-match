import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLS = 7;
const ROWS = 10;
const GRID_PADDING = 16;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - GRID_PADDING * 2) / COLS);

/* ===============================
   EXACT POSITIONS – FROM YOUR IMAGE
================================ */
const BASE_INGREDIENTS = {
    milk: { key: "milk", correct: true, pos: [1, 3] },
    rice: { key: "rice", correct: false, pos: [2, 5] },
    beef: { key: "beef", correct: false, pos: [3, 3] },
    red: { key: "red", correct: false, pos: [3, 4] },
    oil: { key: "oil", correct: true, pos: [4, 6] },

    soda: { key: "soda", correct: true, pos: [5, 2] },
    oats: { key: "oats", correct: false, pos: [6, 3] },
    butter: { key: "butter", correct: true, pos: [7, 2] },
    perfume: { key: "perfume", correct: false, pos: [3, 7] },

    sugar: { key: "sugar", correct: true, pos: [6, 7] },
    salt: { key: "salt", correct: true, pos: [7, 6] },
    flour: { key: "flour", correct: true, pos: [8, 3] },
    wine: { key: "wine", correct: false, pos: [8, 7] },

    juice: { key: "juice", correct: false, pos: [7, 4] },
    potato: { key: "potato", correct: false, pos: [9, 4] },
    lemon: { key: "lemon", correct: false, pos: [9, 6] },
    eggs: { key: "eggs", correct: true, pos: [2, 2] },
};

const REQUIRED = 8;

export default function BakingStepTwoScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const [selected, setSelected] = useState([]);
    const [wrongKey, setWrongKey] = useState(null);
    const [mode, setMode] = useState("idle"); // idle | mix | break

    /* ANIMATIONS */
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const startMix = () => {
        setMode("mix");
        rotateAnim.setValue(0);
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start(() => setMode("idle"));
    };

    const [success, setSuccess] = useState(false);

    const startBreak = () => {
        setMode("break");
        shakeAnim.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: 1,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: -1,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 80,
                useNativeDriver: true,
            }),
        ]).start(() => setMode("idle"));
    };

    const onSelect = (item) => {
        if (selected.includes(item.key) || success) return;

        if (!item.correct) {
            setWrongKey(item.key);
            startBreak();
            setTimeout(() => setWrongKey(null), 500);
            return;
        }

        const updated = [...selected, item.key];
        setSelected(updated);
        startMix();

        if (updated.length === REQUIRED) {
            setSuccess(true);
        }
    };

    const goNext = () => {
        router.replace("/level/7"); // next level
    };


    const renderCell = (row, col) => {
        // POT AREA (center 2x2 block)
        if ((row === 5 || row === 6) && (col === 4 || col === 5)) {
            return <View key={`pot-space-${row}-${col}`} style={styles.emptyCell} />;
        }

        const found = Object.values(BASE_INGREDIENTS).find(
            (i) => i.pos[0] === row && i.pos[1] === col
        );

        if (!found) {
            return <View key={`empty-${row}-${col}`} style={styles.emptyCell} />;
        }

        const isSelected = selected.includes(found.key);
        const isWrong = wrongKey === found.key;

        return (
            <Pressable
                key={found.key}
                onPress={() => onSelect(found)}
                style={[
                    styles.card,
                    isSelected && styles.correctCard,
                    isWrong && styles.wrongCard,
                ]}
            >
                <Text style={styles.cardText}>
                    {t(`ingredients.${found.key}`)}
                </Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back-outline" size={28} />
                </Pressable>
                <Text style={styles.title}>{t("baking.step2Title")}</Text>
            </View>

            <Text style={styles.subtitle}>{t("baking.step2Instruction")}</Text>

            {/* GRID */}
            <View style={styles.gridWrapper}>
                {Array.from({ length: ROWS }).map((_, r) => (
                    <View key={r} style={styles.row}>
                        {Array.from({ length: COLS }).map((_, c) =>
                            renderCell(r + 1, c + 1)
                        )}
                    </View>
                ))}

                {/* POT */}
                <Animated.View
                    style={[
                        styles.pot,
                        {
                            transform: [
                                {
                                    rotate:
                                        mode === "mix"
                                            ? rotateAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ["0deg", "360deg"],
                                            })
                                            : "0deg",
                                },
                                {
                                    translateX:
                                        mode === "break"
                                            ? shakeAnim.interpolate({
                                                inputRange: [-1, 1],
                                                outputRange: [-10, 10],
                                            })
                                            : 0,
                                },
                            ],
                        },
                    ]}
                >
                    <Text style={styles.potText}>
                        {mode === "break" ? t("baking.breaking") : t("baking.mixing")}
                    </Text>
                </Animated.View>
            </View>

            <Text style={styles.pickText}>
                {t("baking.pickCount", { count: REQUIRED - selected.length })}
            </Text>

            {/* ================== SUCCESS POPUP ================== */}
            <Modal transparent visible={success} animationType="fade">
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

/* ===============================
   STYLES
================================ */
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        paddingTop: 50,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },

    backBtn: {
        width: 44,
        height: 44,
        justifyContent: "center",
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 12,
    },

    subtitle: {
        textAlign: "center",
        marginVertical: 10,
        fontSize: 16,
        color: "#9a1b1bff",
        fontWeight: "600",
    },

    gridWrapper: {
        alignSelf: "center",
        marginTop: 30,
        marginLeft: -50,
    },

    row: {
        flexDirection: "row",
    },

    emptyCell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
    },

    card: {
        width: CELL_SIZE + 3,
        height: CELL_SIZE - 4,
        backgroundColor: "#f6f5c2ff",
        margin: 3,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },

    cardText: {
        fontSize: 12,
        fontWeight: "700",
        textAlign: "center",
    },

    correctCard: {
        backgroundColor: "#00a120ff",
    },

    wrongCard: {
        backgroundColor: "#ff4848ff",
    },

    pot: {
        position: "absolute",
        left: CELL_SIZE * 3,
        top: CELL_SIZE * 4,
        width: CELL_SIZE * 2,
        height: CELL_SIZE * 2,
        borderRadius: 999,
        backgroundColor: "#fff700ff",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 18,
    },

    potText: {
        fontWeight: "800",
        color: "#981b9aff",
    },

    pickText: {
        textAlign: "center",
        marginTop: -20,
        fontSize: 16,
        fontWeight: "700",
        color: "#9a1b1bff",
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
