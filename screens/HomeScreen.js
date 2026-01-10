import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Svg, { Path, Text as SvgText, TextPath } from "react-native-svg";

export default function HomeScreen() {
    return (
        <LinearGradient
            colors={["#c0ecffff", "#43ec51ff", "#f2a100ff"]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>

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
                                FOOD & MATCH
                            </TextPath>
                        </SvgText>
                    </Svg>

                    {/* POT */}
                    <View style={styles.potBox}>
                        <Text style={styles.pot}>🍲</Text>
                    </View>

                    <Text style={styles.tagline}>Think. Cook. Match.</Text>

                    <Pressable style={styles.startButton}>
                        <Text style={styles.startText}>START</Text>
                    </Pressable>
                </View>

                {/* BOTTOM BAR – ICON BUTTONS */}
                <View style={styles.bottomBar}>
                    <Pressable style={styles.bottomBox}>
                        <Ionicons name="home-outline" size={30} color="#000000ff" />
                    </Pressable>

                    <Pressable style={styles.bottomBox}>
                        <Ionicons name="notifications-outline" size={30} color="#000000ff" />
                    </Pressable>

                    <Pressable style={styles.bottomBox}>
                        <Ionicons name="person-outline" size={30} color="#000000ff" />
                    </Pressable>

                    <Pressable style={styles.bottomBox}>
                        <Ionicons name="settings-outline" size={30} color="#000000ff" />
                    </Pressable>

                    <Pressable style={styles.bottomBox}>
                        <Ionicons name="close-circle-outline" size={30} color="#000000ff" />
                    </Pressable>
                </View>

            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },

    container: {
        flex: 1,
        justifyContent: "space-between",
    },

    /* CENTER */
    center: {
        alignItems: "center",
        marginTop: 100,
    },

    potBox: {
        backgroundColor: "rgba(255,255,255,0.25)",
        padding: 40,
        borderRadius: 100,
        marginTop: -20,
        marginBottom: 40,
        padding: 50,
    },
    pot: {
        fontSize: 110,
    },
    tagline: {
        color: "#ffffffff",
        marginBottom: 40,
        letterSpacing: 0.5,
        fontSize: 20,
    },

    startButton: {
        backgroundColor: "#F4B942",
        paddingVertical: 16,
        paddingHorizontal: 70,
        borderRadius: 40,
        elevation: 6,
    },
    startText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#3A1A0A",
    },

    /* BOTTOM BAR – SAME LINE, 3 BOXES */
    bottomBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        paddingBottom: 20,
    },
    bottomBox: {
        flex: 1,
        marginHorizontal: 6,
        backgroundColor: "rgba(0,0,0,0.25)",
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
    },
    bottomIcon: {
        fontSize: 28,
        color: "#FFF",
    },
});
