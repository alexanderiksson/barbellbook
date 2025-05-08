import { useState, useMemo } from "react";
import { useWorkout } from "../context/WorkoutContext";
import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import Chart from "../components/pages/Stats/Chart";

export default function Stats() {
    const { workouts } = useWorkout();

    // Function to handle year filter
    const years = useMemo(
        () =>
            Array.from(
                new Set(workouts.map((workout) => new Date(workout.date).getFullYear()))
            ).sort((a, b) => b - a),
        [workouts]
    );

    const initialSelectedYear = years.length > 0 ? years[0].toString() : "";
    const [selectedYear, setSelectedYear] = useState<string>(initialSelectedYear);

    // Function to calculate stats data
    const calculateData = (key: "sessions" | "sets" | "reps") => {
        return Array.from(
            workouts.reduce((acc, workout) => {
                const workoutDate = new Date(workout.date);
                if (workoutDate.getFullYear().toString() === selectedYear) {
                    const month = workoutDate.toLocaleString("default", { month: "short" });
                    if (key === "sessions") {
                        acc.set(month, (acc.get(month) || 0) + 1);
                    } else {
                        workout.exercises.forEach((exercise) => {
                            if (key === "sets") {
                                acc.set(month, (acc.get(month) || 0) + exercise.sets.length);
                            } else if (key === "reps") {
                                acc.set(
                                    month,
                                    (acc.get(month) || 0) +
                                        exercise.sets.reduce((sum, set) => sum + set.reps, 0)
                                );
                            }
                        });
                    }
                }
                return acc;
            }, new Map<string, number>())
        ).map(([month, value]) => ({ month, [key]: value }));
    };

    const sessions = useMemo(() => calculateData("sessions"), [workouts, selectedYear]);
    const sets = useMemo(() => calculateData("sets"), [workouts, selectedYear]);
    const reps = useMemo(() => calculateData("reps"), [workouts, selectedYear]);

    return (
        <div className="content">
            <BackButton to="/history" label="Back" />
            <PageHeading>Stats</PageHeading>

            {workouts.length <= 0 ? (
                <p className="text-neutral-500">No workouts found.</p>
            ) : (
                <>
                    <select
                        className="py-2 w-full text-center border border-white/10 rounded-xl bg-neutral-900 text-sm mb-4"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {years.map((year, index) => (
                            <option key={index} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <section className="flex flex-col gap-6 pt-4">
                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                            <h2 className="text-lg font-semibold mb-4 text-neutral-400">
                                Workouts
                            </h2>
                            <Chart data={sessions} />
                        </div>

                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                            <h2 className="text-lg font-semibold mb-4 text-neutral-400">Sets</h2>
                            <Chart data={sets} />
                        </div>

                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                            <h2 className="text-lg font-semibold mb-4 text-neutral-400">Reps</h2>
                            <Chart data={reps} />
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
