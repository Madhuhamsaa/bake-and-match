import { useLocalSearchParams } from "expo-router";
import MemoryEmojiScreen from "../../screens/MemoryEmojiScreen";
import MemoryWordScreen from "../../screens/MemoryWordScreen";

export default function LevelRouter() {
    const { id } = useLocalSearchParams();
    const level = Number(id);

    if (level === 1) return <MemoryEmojiScreen level={level} />;
    if (level === 2) return <MemoryWordScreen level={level} />;

    return null;
}
