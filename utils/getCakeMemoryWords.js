import { CAKE_WORD_KEYS } from "../data/foods/cake/words";

export const getCakeMemoryWords = (level) => {
    // Level 2 → 3 pairs
    if (level === 2) {
        return CAKE_WORD_KEYS.slice(0, 3);
    }

    // Level 5 → 6 pairs
    if (level === 5) {
        return CAKE_WORD_KEYS.slice(3, 9);
    }

    return [];
};
