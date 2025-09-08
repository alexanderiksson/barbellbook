import { useSettings } from "../context/SettingsContext";
import { useTabNavigation } from "../hooks/useTabNavigation";

import PageHeading from "../components/common/PageHeading";
import { Select } from "../components/common/Inputs";
import TabNavigation from "../components/common/TabNavigation";
import About from "../components/pages/Settings/About";
import Data from "../components/pages/Settings/Data";

export default function Settings() {
    const { weightUnit, setWeightUnit } = useSettings();

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
                <section id="general">
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
                </section>
            )}

            {activeTab === "data" && <Data />}

            {activeTab === "about" && <About />}
        </div>
    );
}
