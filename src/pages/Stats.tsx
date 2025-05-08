import { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import Chart from "../components/pages/Stats/Chart";

export default function Stats() {
    const { workouts } = useWorkout();

    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

    const years = Array.from(
        new Set(workouts.map((workout) => new Date(workout.date).getFullYear()))
    ).sort((a, b) => b - a);

    const sessions = Array.from(
        workouts.reduce((acc, workout) => {
            const workoutDate = new Date(workout.date);
            if (workoutDate.getFullYear().toString() === selectedYear) {
                const month = workoutDate.toLocaleString("default", { month: "short" });
                acc.set(month, (acc.get(month) || 0) + 1);
            }
            return acc;
        }, new Map())
    ).map(([month, Sessions]) => ({ month, Sessions }));

    const sets = Array.from(
        workouts.reduce((acc, workout) => {
            const workoutDate = new Date(workout.date);
            if (workoutDate.getFullYear().toString() === selectedYear) {
                const month = workoutDate.toLocaleString("default", { month: "short" });
                workout.exercises.forEach((exercise) => {
                    acc.set(month, (acc.get(month) || 0) + exercise.sets.length);
                });
            }
            return acc;
        }, new Map())
    ).map(([month, Sets]) => ({ month, Sets }));

    const reps = Array.from(
        workouts.reduce((acc, workout) => {
            const workoutDate = new Date(workout.date);
            if (workoutDate.getFullYear().toString() === selectedYear) {
                const month = workoutDate.toLocaleString("default", { month: "short" });
                workout.exercises.forEach((exercise) => {
                    acc.set(
                        month,
                        (acc.get(month) || 0) +
                            exercise.sets.reduce((sum, set) => sum + set.reps, 0)
                    );
                });
            }
            return acc;
        }, new Map())
    ).map(([month, Reps]) => ({ month, Reps }));

    const totalSets = workouts.reduce((total, workout) => {
        return total + workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
    }, 0);

    console.log(selectedYear);

    return (
        <div className="content">
            <BackButton to="/history" label="Back" />
            <PageHeading>Stats</PageHeading>

            <select
                className="py-2 w-full text-center border border-white/10 rounded-xl bg-neutral-900 text-sm mb-8"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
            >
                {years.map((year, index) => (
                    <option key={index} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            {workouts.length < 0 ? (
                <p className="text-neutral-500">No workouts found.</p>
            ) : (
                <section className="flex flex-col gap-6 pt-4">
                    <div className="grid grid-cols-2 gap-6 text-center">
                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                            <h2 className="text-xl font-semibold mb-4 text-neutral-400">
                                Total workouts
                            </h2>
                            <p className="text-2xl">{workouts.length}</p>
                        </div>

                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                            <h2 className="text-xl font-semibold mb-4 text-neutral-400">
                                Total sets
                            </h2>
                            <p className="text-2xl">{totalSets}</p>
                        </div>
                    </div>

                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-400">
                            Workouts {new Date().getFullYear()}
                        </h2>
                        <Chart data={sessions} />
                    </div>

                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-400">
                            Sets {new Date().getFullYear()}
                        </h2>
                        <Chart data={sets} />
                    </div>

                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-400">
                            Reps {new Date().getFullYear()}
                        </h2>
                        <Chart data={reps} />
                    </div>
                </section>
            )}
        </div>
    );
}
