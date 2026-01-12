import { useLocalSearchParams } from "expo-router";
import BakingStepOneScreen from "../../screens/BakingStepOneScreen";
import MemoryEmojiScreen from "../../screens/MemoryEmojiScreen";
import MemoryWordScreen from "../../screens/MemoryWordScreen";

export default function LevelRouter() {
    const { id } = useLocalSearchParams();
    const level = Number(id);

    if (level === 1) return <MemoryEmojiScreen level={level} />;
    if (level === 2) return <MemoryWordScreen level={level} />;
    if (level === 3) return <BakingStepOneScreen level={level} />;

    return null;
}
