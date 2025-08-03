import { createContext, useContext, useState, ReactNode } from "react";

export type WeightUnit = "kg" | "lb";

interface SettingsContextType {
    weightUnit: WeightUnit;
    setWeightUnit: (unit: WeightUnit) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const getInitialUnit = (): WeightUnit => {
        const stored = localStorage.getItem("weightUnit");
        return stored === "kg" || stored === "lb" ? stored : "kg";
    };
    const [weightUnit, setWeightUnitState] = useState<WeightUnit>(getInitialUnit());

    const setWeightUnit = (unit: WeightUnit) => {
        setWeightUnitState(unit);
        localStorage.setItem("weightUnit", unit);
    };

    return (
        <SettingsContext.Provider value={{ weightUnit, setWeightUnit }}>
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
