import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

export type WeightUnit = "kg" | "lb";
export type Theme = "light" | "dark" | "system";

interface SettingsContextType {
    weightUnit: WeightUnit;
    setWeightUnit: (unit: WeightUnit) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    actualTheme: "light" | "dark"; // The resolved theme (system preference resolved)
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Function to update status bar based on theme
const updateStatusBar = async (theme: "light" | "dark") => {
    if (!Capacitor.isNativePlatform()) return;

    try {
        if (theme === "light") {
            await StatusBar.setStyle({ style: Style.Light });
            await StatusBar.setBackgroundColor({ color: "#ffffff" });
        } else {
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: "#0f0f11" });
        }
    } catch (error) {
        console.log("StatusBar not available:", error);
    }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const getInitialUnit = (): WeightUnit => {
        const stored = localStorage.getItem("weightUnit");
        return stored === "kg" || stored === "lb" ? stored : "kg";
    };

    const getInitialTheme = (): Theme => {
        const stored = localStorage.getItem("theme");
        return stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
    };

    const getSystemTheme = (): "light" | "dark" => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const resolveTheme = (theme: Theme): "light" | "dark" => {
        return theme === "system" ? getSystemTheme() : theme;
    };

    const [weightUnit, setWeightUnitState] = useState<WeightUnit>(getInitialUnit());
    const [theme, setThemeState] = useState<Theme>(getInitialTheme());
    const [actualTheme, setActualTheme] = useState<"light" | "dark">(() =>
        resolveTheme(getInitialTheme())
    );

    const setWeightUnit = (unit: WeightUnit) => {
        setWeightUnitState(unit);
        localStorage.setItem("weightUnit", unit);
    };

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("theme", newTheme);
        const resolved = resolveTheme(newTheme);
        setActualTheme(resolved);

        // Update status bar color
        await updateStatusBar(resolved);
    };

    useEffect(() => {
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = async () => {
                const newSystemTheme = getSystemTheme();
                setActualTheme(newSystemTheme);
                await updateStatusBar(newSystemTheme);
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    // Initialize status bar on app load
    useEffect(() => {
        updateStatusBar(actualTheme);
    }, [actualTheme]);

    return (
        <SettingsContext.Provider
            value={{ weightUnit, setWeightUnit, theme, setTheme, actualTheme }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
