import { useLocalSearchParams } from "expo-router";
import { LEVELS } from "../../constants/levels";

import BakingStepOneScreen from "../../screens/BakingStepOneScreen";
import MemoryEmojiScreen from "../../screens/MemoryEmojiScreen";
import MemoryWordScreen from "../../screens/MemoryWordScreen";

export default function LevelRouter() {
    const { id } = useLocalSearchParams();
    const level = Number(id);

    const config = LEVELS[level];
    if (!config) return null;

    if (config.type === "memoryEmoji") {
        return <MemoryEmojiScreen level={level} />;
    }

    if (config.type === "memoryWord") {
        return <MemoryWordScreen level={level} />;
    }

    if (config.type === "baking") {
        return <BakingStepOneScreen level={level} />;
    }

    return null;
}
