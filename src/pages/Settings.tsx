import { useState, useRef } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { useSettings } from "../context/SettingsContext";
import useModal from "../hooks/useModal";
import { WorkoutType } from "../types/workout";

import PageHeading from "../components/common/PageHeading";
import { Select } from "../components/common/Inputs";
import { Button } from "../components/common/Buttons";
import Notice from "../components/common/Notice";
import { ConfirmModal } from "../components/common/Modals";
import TabNavigation from "../components/common/TabNavigation";

import { TbFileExport, TbFileImport } from "react-icons/tb";
import { MdOutlineDangerous } from "react-icons/md";

export default function Settings() {
    const { workouts, addWorkout, clearWorkouts } = useWorkout();
    const { weightUnit, setWeightUnit } = useSettings();

    const [activeTab, setActiveTab] = useState<"general" | "data" | "about">("general");

    // Manage modal state
    const importConfirmModal = useModal();
    const clearDataConfirmModal = useModal();

    // Trigger to show notice
    const noticeTriggerRef = useRef<() => void | null>(null);
    const [noticeMsg, setNoticeMsg] = useState<string>("");

    // Save imported data function
    const [importedWorkouts, setImportedWorkouts] = useState<WorkoutType[] | null>(null);
    const importData = () => {
        if (importedWorkouts && Array.isArray(importedWorkouts)) {
            importedWorkouts.forEach((workout) => addWorkout(workout));

            // Trigger the notice
            setNoticeMsg("Data imported successfully");
            if (noticeTriggerRef.current) {
                noticeTriggerRef.current();
            }
        } else {
            console.error("Invalid file format");
        }
    };

    // Handle data export
    const handleExport = (): void => {
        const data: string = JSON.stringify(workouts);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "workouts.json";
        a.click();

        URL.revokeObjectURL(url);
    };

    // Handle data import
    const handleImport = (): void => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const data = await file.text();

            try {
                setImportedWorkouts(JSON.parse(data));
                importConfirmModal.open();
            } catch (error) {
                console.error("Error parsing JSON file", error);
            }
        };

        input.click();
    };

    // Handle tab change
    const handleTabChange = (tabId: string) => {
        if (tabId === "general" || tabId === "data" || tabId === "about") {
            setActiveTab(tabId);
        }
    };

    return (
        <>
            <ConfirmModal
                text="Are you sure you want to import data?"
                buttonText="Import"
                isOpen={importConfirmModal.isOpen}
                onClose={importConfirmModal.close}
                action={() => {
                    importConfirmModal.close();
                    importData();
                }}
            />

            <ConfirmModal
                text="This will permanently delete your data, are you sure?"
                buttonText="Clear data"
                buttonVariant="danger"
                isOpen={clearDataConfirmModal.isOpen}
                onClose={clearDataConfirmModal.close}
                action={() => {
                    clearDataConfirmModal.close();
                    if (confirm("Are you sure?")) {
                        clearWorkouts();

                        setNoticeMsg("Data cleared");
                        if (noticeTriggerRef.current) {
                            noticeTriggerRef.current();
                        }
                    }
                }}
            />

            <div className="content">
                <Notice
                    msg={noticeMsg}
                    registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
                />

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
                                <option value="kg">kg</option>
                                <option value="lb">lb</option>
                            </Select>
                        </div>
                    </section>
                )}

                {activeTab === "data" && (
                    <section id="data" className="flex flex-col gap-4">
                        <div className="p-4 bg-secondary rounded-2xl border border-border/20">
                            <h2 className="mb-6 text-text-grey text-sm">Export / Import</h2>
                            <div className="flex gap-4 flex-wrap">
                                <Button onClick={handleExport} variant="blue">
                                    <TbFileExport size={20} /> Export data
                                </Button>
                                <Button onClick={handleImport}>
                                    <TbFileImport size={20} /> Import data
                                </Button>
                            </div>
                        </div>

                        <div className="p-4 bg-danger/10 rounded-2xl border border-danger/20">
                            <h2 className="mb-6 text-text-grey text-sm">Danger zone</h2>
                            <div className="flex gap-4 flex-wrap">
                                <Button variant="danger" onClick={clearDataConfirmModal.open}>
                                    <MdOutlineDangerous size={20} />
                                    Clear data
                                </Button>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === "about" && (
                    <section id="about">
                        <h2 className="text-xl font-semibold mb-4">About this app</h2>
                        <div className="space-y-4">
                            <p>
                                BarbellBook is a web-based workout logger that lets you effortlessly
                                track your sets, reps, and progress.
                            </p>
                            <p>
                                Your data is securely saved locally in your browser, so you stay in
                                control without any sign-ups or cloud storage.
                            </p>
                            <p>
                                Perfect for lifters of all levels to stay motivated and reach their
                                goals.
                            </p>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
