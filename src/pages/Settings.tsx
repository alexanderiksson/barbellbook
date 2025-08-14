import { useState, useRef } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { useSettings } from "../context/SettingsContext";
import useModal from "../hooks/useModal";
import { WorkoutType } from "../types/workout";
import { Link } from "react-router-dom";

import PageHeading from "../components/common/PageHeading";
import { Select } from "../components/common/Inputs";
import { Button } from "../components/common/Buttons";
import Notice from "../components/common/Notice";
import { ConfirmModal } from "../components/common/Modals";

import { TbFileExport, TbFileImport } from "react-icons/tb";
import { MdOutlineDangerous } from "react-icons/md";
import { IoIosArrowForward, IoIosInformationCircleOutline } from "react-icons/io";

export default function Settings() {
    const { workouts, addWorkout, clearWorkouts } = useWorkout();
    const { weightUnit, setWeightUnit } = useSettings();

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

                <section className="mt-8 flex flex-col gap-4">
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

                    <div className="p-4 bg-secondary rounded-2xl border border-border/20">
                        <h2 className="mb-6 text-text-grey text-sm">Your data</h2>
                        <div className="flex gap-4 flex-wrap">
                            <Button onClick={handleExport} variant="blue">
                                <TbFileExport size={20} /> Export data
                            </Button>
                            <Button onClick={handleImport}>
                                <TbFileImport size={20} /> Import data
                            </Button>
                            <Button variant="danger" onClick={clearDataConfirmModal.open}>
                                <MdOutlineDangerous size={20} />
                                Clear data
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="mt-8">
                    <Link to="/settings/about">
                        <div className="p-4 bg-secondary rounded-2xl border border-border/20 flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <IoIosInformationCircleOutline size={20} />
                                <h2>About this app</h2>
                            </div>
                            <IoIosArrowForward size={20} />
                        </div>
                    </Link>
                </section>
            </div>
        </>
    );
}
