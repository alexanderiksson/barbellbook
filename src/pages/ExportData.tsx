import { useWorkout } from "../context/WorkoutContext";
import PageHeading from "../components/common/PageHeading";
import { Button } from "../components/common/Buttons";

export default function ExportData() {
    const { workouts } = useWorkout();

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

    return (
        <div className="content">
            <PageHeading>Export data</PageHeading>
            <div className="flex gap-2">
                <Button variant="blue" onClick={handleExport}>
                    Export
                </Button>
                <Button>Import</Button>
            </div>
        </div>
    );
}
