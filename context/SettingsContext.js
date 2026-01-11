import { createContext, useContext, useState } from "react";

const SettingsContext = createContext({
    fontSize: 16,
    setFontSize: () => { },
});

export function SettingsProvider({ children }) {
    const [fontSize, setFontSize] = useState(16);

    return (
        <SettingsContext.Provider value={{ fontSize, setFontSize }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
