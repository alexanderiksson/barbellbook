import { useMemo } from "react";
import { WorkoutType } from "../../../types/workout";
import exercisesData from "../../../data/exercises.json";
import { useSettings } from "../../../context/SettingsContext";

export default function PowerliftingStats({
    workouts,
    year,
}: {
    workouts: WorkoutType[];
    year: string;
}) {
    const { weightUnit } = useSettings();

    const stats = useMemo(() => {
        const getPRById = (exerciseId: number): number => {
            const exerciseData = exercisesData.find((ex) => ex.id === exerciseId);
            if (!exerciseData) {
                return 0;
            }

            const exerciseName = exerciseData.name;
            let maxWeight = 0;

            workouts
                .filter((workout) => new Date(workout.date).getFullYear().toString() === year)
                .forEach((workout) => {
                    const exercise = workout.exercises.find((ex) => ex.name === exerciseName);
                    if (exercise) {
                        exercise.sets.forEach((set) => {
                            if (Number(set.weight) > Number(maxWeight)) {
                                maxWeight = Number(set.weight);
                            }
                        });
                    }
                });

            return maxWeight;
        };

        return {
            squat: getPRById(25),
            benchpress: getPRById(1),
            deadlift: getPRById(33),
            total: Number(getPRById(25)) + Number(getPRById(1)) + Number(getPRById(33)),
        };
    }, [workouts, year]);

    return (
        <div className="bg-[var(--secondary)] p-4 rounded-[var(--radius)] border border-[var(--border)]/20">
            <h2 className="mb-6 text-[var(--text-grey)] text-sm">Powerlifting stats</h2>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[var(--secondary-bright)] p-2 rounded-[var(--radius)] border border-[var(--border)]/20 flex flex-col gap-1">
                        <h3 className="text-xs truncate">Squat</h3>
                        <span>{stats.squat > 0 ? `${stats.squat} ${weightUnit}` : "No data"}</span>
                    </div>

                    <div className="bg-[var(--secondary-bright)] p-2 rounded-[var(--radius)] border border-[var(--border)]/20 flex flex-col gap-1">
                        <h3 className="text-xs truncate">Benchpress</h3>
                        <span>
                            {stats.benchpress > 0 ? `${stats.benchpress} ${weightUnit}` : "No data"}
                        </span>
                    </div>
                    <div className="bg-[var(--secondary-bright)] p-2 rounded-[var(--radius)] border border-[var(--border)]/20 flex flex-col gap-1">
                        <h3 className="text-xs truncate">Deadlift</h3>
                        <span>
                            {stats.deadlift > 0 ? `${stats.deadlift} ${weightUnit}` : "No data"}
                        </span>
                    </div>
                </div>
                {stats.total > 0 && (
                    <div className="bg-[var(--secondary-bright)] p-3 rounded-[var(--radius)] border border-[var(--border)]/20 flex justify-between items-center text-lg font-bold">
                        <h3>Total</h3>
                        <span>
                            {stats.total} {weightUnit}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
