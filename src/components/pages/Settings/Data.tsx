import { useState, useRef } from "react";
import { WorkoutType } from "../../../types/workout";
import { useWorkout } from "../../../context/WorkoutContext";

import { ConfirmModal } from "../../common/Modals";
import Notice from "../../common/Notice";
import { Button } from "../../common/Buttons";
import useModal from "../../../hooks/useModal";

import { TbFileExport, TbFileImport } from "react-icons/tb";
import { MdOutlineDangerous } from "react-icons/md";

export default function Data() {
    const { workouts, addWorkout, clearWorkouts } = useWorkout();

    // Manage modal state
    const importConfirmModal = useModal();
    const clearDataConfirmModal = useModal();

    // Trigger to show notice
    const noticeTriggerRef = useRef<() => void | null>(null);
    const [noticeMsg, setNoticeMsg] = useState<string>("");

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
            <Notice
                msg={noticeMsg}
                registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
            />

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
            <section id="data" className="flex flex-col gap-4">
                <div className="p-4 bg-[var(--secondary)] rounded-[var(--radius)] border border-[var(--border)]/20">
                    <h2 className="mb-6 text-[var(--text-grey)] text-sm">Export / Import</h2>
                    <div className="flex gap-4 flex-wrap">
                        <Button onClick={handleExport} variant="blue">
                            <TbFileExport size={20} /> Export data
                        </Button>
                        <Button onClick={handleImport}>
                            <TbFileImport size={20} /> Import data
                        </Button>
                    </div>
                </div>

                <div className="p-4 bg-[var(--danger)]/10 rounded-[var(--radius)] border border-[var(--danger)]/20">
                    <h2 className="mb-6 text-[var(--text-grey)] text-sm">Danger zone</h2>
                    <div className="flex gap-4 flex-wrap">
                        <Button variant="danger" onClick={clearDataConfirmModal.open}>
                            <MdOutlineDangerous size={20} />
                            Clear data
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
