import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import Chart from "../components/pages/Stats/LineChart";

export default function ExerciseStats() {
    const { exercise } = useParams<{ exercise: string }>();
    const { workouts } = useWorkout();

    const data = workouts
        .filter((workout) => workout.exercises.some((ex) => ex.name === exercise))
        .map((workout) => {
            const exerciseData = workout.exercises.find((ex) => ex.name === exercise);
            const maxWeight = exerciseData
                ? Math.max(...exerciseData.sets.map((set) => Number(set.weight)))
                : 0;
            return {
                date: workout.date,
                Weight: maxWeight,
            };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log(data);

    return (
        <div className="content">
            <BackButton label="Stats" to="/stats" />
            <PageHeading>{exercise}</PageHeading>

            <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/3">
                <h2 className="text-lg font-semibold mb-6 text-neutral-400">Top weight (kg)</h2>
                <Chart data={data} />
            </div>
        </div>
    );
}
