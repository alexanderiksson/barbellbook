import { useSettings } from "../context/SettingsContext";
import { useTabNavigation } from "../hooks/useTabNavigation";
import { Theme } from "../context/SettingsContext";

import PageHeading from "../components/common/PageHeading";
import { Select } from "../components/common/Inputs";
import TabNavigation from "../components/common/TabNavigation";
import About from "../components/pages/Settings/About";
import Data from "../components/pages/Settings/Data";

export default function Settings() {
    const { weightUnit, setWeightUnit, theme, setTheme } = useSettings();

    // Manage tab changes
    const validTabs = ["general", "data", "about"] as const;
    const { activeTab, handleTabChange } = useTabNavigation("general", validTabs);

    return (
        <div className="content">
            <PageHeading>Settings</PageHeading>

            <TabNavigation
                tabs={[
                    { id: "general", label: "General" },
                    { id: "data", label: "Data" },
                    { id: "about", label: "About" },
                ]}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {activeTab === "general" && (
                <section id="general" className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm">Weight unit</label>
                        <Select
                            value={weightUnit}
                            onChange={(e) => setWeightUnit(e.target.value as "kg" | "lb")}
                        >
                            <option value="kg">Metric (kg)</option>
                            <option value="lb">Imperial (lb)</option>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm">Theme</label>
                        <Select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="system">Automatic</option>
                        </Select>
                    </div>
                </section>
            )}

            {activeTab === "data" && <Data />}

            {activeTab === "about" && <About />}
        </div>
    );
}
