import { CAKE_EMOJIS } from "../data/foods/cake/emojis";

export const getCakeMemoryEmojis = (level) => {
    if (level === 1) return CAKE_EMOJIS.slice(0, 3);
    if (level === 4) return CAKE_EMOJIS.slice(3, 9);
    if (level === 8) return CAKE_EMOJIS.slice(9, 18);
    return [];
};
