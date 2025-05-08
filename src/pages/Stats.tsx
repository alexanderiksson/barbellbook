import { useWorkout } from "../context/WorkoutContext";
import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import Chart from "../components/pages/Stats/Chart";

export default function Stats() {
    const { workouts } = useWorkout();

    const sessions = Array.from(
        workouts.reduce((acc, workout) => {
            const month = new Date(workout.date).toLocaleString("default", { month: "short" });
            acc.set(month, (acc.get(month) || 0) + 1);
            return acc;
        }, new Map())
    ).map(([month, Sessions]) => ({ month, Sessions }));

    const sets = Array.from(
        workouts.reduce((acc, workout) => {
            const month = new Date(workout.date).toLocaleString("default", { month: "short" });
            workout.exercises.forEach((exercise) => {
                acc.set(month, (acc.get(month) || 0) + exercise.sets.length);
            });
            return acc;
        }, new Map())
    ).map(([month, Sets]) => ({ month, Sets }));

    const reps = Array.from(
        workouts.reduce((acc, workout) => {
            const month = new Date(workout.date).toLocaleString("default", { month: "short" });
            workout.exercises.forEach((exercise) => {
                acc.set(
                    month,
                    (acc.get(month) || 0) + exercise.sets.reduce((sum, set) => sum + set.reps, 0)
                );
            });
            return acc;
        }, new Map())
    ).map(([month, Reps]) => ({ month, Reps }));

    return (
        <div className="content">
            <BackButton to="/history" label="Back" />
            <PageHeading>Stats</PageHeading>

            {workouts.length < 0 ? (
                <p className="text-neutral-500">No workouts found.</p>
            ) : (
                <section className="flex flex-col gap-6 pt-4">
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-400">Workouts</h2>
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
            )}
        </div>
    );
}
