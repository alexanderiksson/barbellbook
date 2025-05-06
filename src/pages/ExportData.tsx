import { useRef } from "react";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import { Button } from "../components/common/Buttons";
import BackButton from "../components/common/BackButton";
import Notice from "../components/common/Notice";

import { TbFileExport } from "react-icons/tb";
import { TbFileImport } from "react-icons/tb";

export default function ExportData() {
    const { workouts, addWorkout } = useWorkout();

    // Trigger to show notice
    const noticeTriggerRef = useRef<() => void | null>(null);

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

    const handleImport = (): void => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const text = await file.text();
            try {
                const importedWorkouts = JSON.parse(text);
                if (Array.isArray(importedWorkouts)) {
                    importedWorkouts.forEach((workout) => addWorkout(workout));

                    // Trigger the notice
                    if (noticeTriggerRef.current) {
                        noticeTriggerRef.current();
                    }
                } else {
                    console.error("Invalid file format");
                }
            } catch (error) {
                console.error("Error parsing JSON file", error);
            }
        };

        input.click();
    };

    return (
        <div className="content">
            <Notice
                msg="Data imported successfully"
                registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
            />

            <BackButton to="/history" label="Back" />
            <PageHeading>Export data</PageHeading>
            <div className="flex gap-4 mt-8">
                <Button onClick={handleExport}>
                    <TbFileExport size={20} /> Export
                </Button>
                <Button onClick={handleImport} variant="blue">
                    <TbFileImport size={20} /> Import
                </Button>
            </div>
        </div>
    );
}
