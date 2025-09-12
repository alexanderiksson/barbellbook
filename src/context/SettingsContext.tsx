import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

export type WeightUnit = "kg" | "lb";
export type Theme = "light" | "dark" | "system";

interface SettingsContextType {
    weightUnit: WeightUnit;
    setWeightUnit: (unit: WeightUnit) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    actualTheme: "light" | "dark";
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
    children: ReactNode;
}

const updateStatusBar = async (theme: "light" | "dark"): Promise<void> => {
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

const getSystemTheme = (): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const resolveTheme = (theme: Theme): "light" | "dark" => {
    return theme === "system" ? getSystemTheme() : theme;
};

export function SettingsProvider({ children }: SettingsProviderProps) {
    const [weightUnit, setWeightUnitState] = useState<WeightUnit>(() => {
        const stored = localStorage.getItem("weightUnit");
        return stored === "kg" || stored === "lb" ? stored : "kg";
    });

    // Theme state
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem("theme");
        return stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
    });

    // Actual theme state
    const [actualTheme, setActualTheme] = useState<"light" | "dark">(() => {
        const stored = localStorage.getItem("theme");
        const initialTheme =
            stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
        return resolveTheme(initialTheme);
    });

    // Function to save weight unit to local storage when state is updated
    useEffect(() => {
        localStorage.setItem("weightUnit", weightUnit);
    }, [weightUnit]);

    // Function to save theme to local storage when state is updated
    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Update weight unit setting
    const setWeightUnit = (unit: WeightUnit): void => {
        setWeightUnitState(unit);
    };

    // Update theme setting
    const setTheme = async (newTheme: Theme): Promise<void> => {
        setThemeState(newTheme);
        const resolved = resolveTheme(newTheme);
        setActualTheme(resolved);

        await updateStatusBar(resolved);
    };

    useEffect(() => {
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleSystemThemeChange = async (): Promise<void> => {
                const newSystemTheme = getSystemTheme();
                setActualTheme(newSystemTheme);
                await updateStatusBar(newSystemTheme);
            };

            mediaQuery.addEventListener("change", handleSystemThemeChange);
            return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
        }
    }, [theme]);

    // Initialize status bar on app load
    useEffect(() => {
        updateStatusBar(actualTheme);
    }, [actualTheme]);

    return (
        <SettingsContext.Provider
            value={{
                weightUnit,
                setWeightUnit,
                theme,
                setTheme,
                actualTheme,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings(): SettingsContextType {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
