import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("theme", newTheme);
        setActualTheme(resolveTheme(newTheme));
    };

    // Listen for system theme changes when theme is set to "system"
    useEffect(() => {
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = () => {
                setActualTheme(getSystemTheme());
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

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
