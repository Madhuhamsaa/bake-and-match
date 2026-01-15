import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const TOTAL_LEVELS = 40;
const NODE_SIZE = 70;
const ROW_HEIGHT = 115;

/* THEME */
const COLORS = ["#D62828", "#F77F00", "#FCBF49"];

/* COLUMN POSITIONS */
const COLUMN_X = [
    width * 0.18,
    width * 0.42,
    width * 0.62,
    width * 0.82,
];

/* YOUR FINAL GRID PATTERN (1–14) */
const GRID_PATTERN = [
    { row: 1, col: 1 },  // L1
    { row: 2, col: 2 },  // L2
    { row: 3, col: 4 },  // L3
    { row: 4, col: 3 },  // L4
    { row: 5, col: 1 },  // L5
    { row: 6, col: 4 },  // L6
    { row: 7, col: 3 },  // L7
    { row: 8, col: 4 },  // L8
    { row: 9, col: 1 },  // L9
    { row: 10, col: 4 }, // L10
    { row: 11, col: 3 }, // L11
    { row: 12, col: 2 }, // L12
    { row: 13, col: 4 }, // L13
    { row: 14, col: 1 }, // L14
];

/* LABEL LOGIC */
const getLevelLabelKey = (level) => {
    const mod = level % 10;

    if (mod === 1 || mod === 4 || mod === 8) return "levels.memoryEmoji";
    if (mod === 2 || mod === 5) return "levels.memoryWord";
    if (mod === 7) return "levels.miniPuzzle";
    if (mod === 9) return "levels.largePuzzle";

    if (mod === 3) return "levels.baking1";
    if (mod === 6) return "levels.baking2";
    if (mod === 0) return "levels.baking3";

    return "";
};

/* POSITION — THIS NOW REPEATS CORRECTLY */
const PATTERN_SIZE = 10;

const getPosition = (level) => {
    const index = (level - 1) % PATTERN_SIZE;
    const cycle = Math.floor((level - 1) / PATTERN_SIZE);

    const { row, col } = GRID_PATTERN[index];

    const top = (cycle * PATTERN_SIZE + row) * ROW_HEIGHT;

    return {
        left: COLUMN_X[col - 1] - NODE_SIZE / 2,
        top,
    };
};

console.log("🔥 MEMORY EMOJI SCREEN LOADED");

export default function PathScreen() {
    const router = useRouter();
    const [unlocked, setUnlocked] = useState(1);
    const { t } = useTranslation();

    useEffect(() => {
        const load = async () => {
            const v = await AsyncStorage.getItem("levelsUnlocked");
            setUnlocked(Number(v) || 1);
        };
        load();
    }, []);

    const PATTERN_SIZE = GRID_PATTERN.length;
    const TOTAL_CYCLES = Math.ceil(TOTAL_LEVELS / PATTERN_SIZE);
    const MAP_HEIGHT = TOTAL_CYCLES * PATTERN_SIZE * ROW_HEIGHT;

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={30} />
                </Pressable>

                <Text style={styles.pageTitle}>
                    {t("path.title")}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={[styles.map, { height: MAP_HEIGHT }]}>

                    {/* CONNECTING LINES */}
                    <Svg width={width} height={MAP_HEIGHT} style={StyleSheet.absoluteFill}>
                        {Array.from({ length: TOTAL_LEVELS - 1 }).map((_, i) => {
                            const start = getPosition(i + 1);
                            const end = getPosition(i + 2);

                            const d = `
                M ${start.left + NODE_SIZE / 2} ${start.top + NODE_SIZE / 2}
                Q ${(start.left + end.left) / 2 + NODE_SIZE / 2}
                  ${start.top + 70}
                  ${end.left + NODE_SIZE / 2}
                  ${end.top + NODE_SIZE / 2}
              `;

                            return (
                                <Path
                                    key={i}
                                    d={d}
                                    stroke="#F77F00"
                                    strokeWidth={3}
                                    fill="none"
                                    opacity={0.35}
                                />
                            );
                        })}
                    </Svg>

                    {/* LEVEL NODES */}
                    {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
                        const level = i + 1;
                        const locked = level > unlocked;
                        const pos = getPosition(level);

                        return (
                            <Pressable
                                key={level}
                                disabled={locked}
                                onPress={() => router.push(`/level/${level}`)}
                                style={[
                                    styles.node,
                                    {
                                        left: pos.left,
                                        top: pos.top,
                                        backgroundColor: locked ? "#ccc" : COLORS[i % COLORS.length],
                                    },
                                ]}
                            >
                                <Text style={styles.levelNumber}>
                                    {locked ? "🔒" : level}
                                </Text>
                                <Text style={styles.levelLabel}>
                                    {t(getLevelLabelKey(level))}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* END TEXT — ONLY AFTER ALL LEVELS */}
                <Text style={styles.teaser}>
                    {t("path.teaser")}
                </Text>

            </ScrollView>
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

    scroll: {
        paddingBottom: 120,
    },

    map: {
        position: "relative",
    },

    node: {
        position: "absolute",
        width: NODE_SIZE,
        height: NODE_SIZE,
        borderRadius: NODE_SIZE / 2,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
    },
    levelNumber: {
        fontSize: 18,
        fontWeight: "800",
        color: "#fff",
    },
    levelLabel: {
        position: "absolute",
        bottom: -22,
        fontSize: 11,
        color: "#333",
        textAlign: "center",
        width: 110,
    },

    teaser: {
        marginTop: 60,
        textAlign: "center",
        fontSize: 16,
        fontStyle: "italic",
        color: "#555",
    },
});
