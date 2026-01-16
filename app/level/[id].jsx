import { useLocalSearchParams } from "expo-router";
import { LEVELS } from "../../constants/levels";

import BakingStepOneScreen from "../../screens/BakingStepOneScreen";
import BakingStepTwoScreen from "../../screens/BakingStepTwoScreen";
import MemoryEmojiScreen from "../../screens/MemoryEmojiScreen";
import MemoryWordScreen from "../../screens/MemoryWordScreen";
// import BakingStepThreeScreen from "../../screens/BakingStepThreeScreen"; // future

export default function LevelRouter() {
    const { id } = useLocalSearchParams();
    const level = Number(id);

    const config = LEVELS[level];
    if (!config) return null;

    /* MEMORY EMOJI */
    if (config.type === "memoryEmoji") {
        return <MemoryEmojiScreen level={level} />;
    }

    /* MEMORY WORD */
    if (config.type === "memoryWord") {
        return <MemoryWordScreen level={level} />;
    }

    /* BAKING STEPS */
    if (config.type === "baking") {
        if (config.layer === 1) {
            return <BakingStepOneScreen level={level} />;
        }

        if (config.layer === 2) {
            return <BakingStepTwoScreen level={level} />;
        }

        // if (config.layer === 3) {
        //     return <BakingStepThreeScreen level={level} />;
        // }
    }

    return null;
}
