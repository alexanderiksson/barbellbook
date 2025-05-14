import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import Chart from "../components/pages/Stats/BarChart";
import { Select } from "../components/common/Inputs";

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
    const calculateData = (key: "sessions" | "exercises") => {
        return Array.from(
            workouts.reduce((acc, workout) => {
                const workoutDate = new Date(workout.date);
                if (workoutDate.getFullYear().toString() === selectedYear) {
                    const month = workoutDate.toLocaleString("en-US", { month: "short" });
                    if (key === "sessions") {
                        acc.set(month, (acc.get(month) || 0) + 1);
                    } else if (key === "exercises") {
                        acc.set(month, (acc.get(month) || 0) + workout.exercises.length);
                    }
                }
                return acc;
            }, new Map<string, number>())
        ).map(([month, value]) => ({ month, [key]: value }));
    };

    const sessions = useMemo(() => calculateData("sessions"), [workouts, selectedYear]);
    const exercises = useMemo(() => calculateData("exercises"), [workouts, selectedYear]);

    const allExercises = useMemo(() => {
        const exerciseCount = workouts.reduce((acc, workout) => {
            workout.exercises.forEach((exercise) => {
                acc[exercise.name] = (acc[exercise.name] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(exerciseCount)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count }));
    }, [workouts]);

    return (
        <div className="content">
            <BackButton to="/history" label="Workout history" />
            <PageHeading>Your stats</PageHeading>

            {workouts.length <= 0 ? (
                <p className="text-neutral-500">No workouts found.</p>
            ) : (
                <>
                    <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {years.map((year, index) => (
                            <option key={index} value={year}>
                                Year: {year}
                            </option>
                        ))}
                    </Select>

                    <section className="flex flex-col gap-6 mb-8">
                        <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/3">
                            <h2 className="font-medium mb-6 text-neutral-400">Workouts</h2>
                            <Chart data={sessions} />
                        </div>

                        <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/3">
                            <h2 className="font-medium mb-6 text-neutral-400">Exercises</h2>
                            <Chart data={exercises} />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Most common exercises</h2>
                        <div className="flex flex-col gap-3">
                            {allExercises.map((exercise, index) => (
                                <Link key={index} to={`/stats/${exercise.name}`}>
                                    <div className="px-5 py-3 bg-zinc-900 rounded-2xl border border-white/3 shadow flex justify-between gap-4">
                                        <h3 className="truncate">{exercise.name}</h3>
                                        <span className="text-neutral-500 shrink-0">
                                            {exercise.count} times
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
