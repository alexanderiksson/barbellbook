import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";

import BackButton from "../components/common/BackButton";
import StatCard from "../components/pages/WorkoutStats/StatCard";

interface Set {
    reps: number;
    weight: number;
}

interface Exercise {
    name: string;
    sets: Set[];
}

interface Workout {
    name?: string;
    date: string;
    exercises: Exercise[];
}

export default function WorkoutStats() {
    const { id } = useParams<{ id: string }>();
    const { workouts } = useWorkout();

    const workout: Workout | undefined = workouts.find(
        (_, index) => index === parseInt(id || "", 10)
    );

    if (!workout) {
        return <p className="text-neutral-500">Workout not found.</p>;
    }

    const totalSets = (): number => {
        return workout.exercises.reduce((sets, exercise) => sets + exercise.sets.length, 0);
    };

    const totalReps = (): number => {
        return workout.exercises.reduce(
            (reps, exercise) =>
                reps + exercise.sets.reduce((setReps, set) => setReps + set.reps, 0),
            0
        );
    };

    const totalWeight = (): number => {
        return workout.exercises.reduce(
            (weight, exercise) =>
                weight +
                exercise.sets.reduce((setWeight, set) => setWeight + set.weight * set.reps, 0),
            0
        );
    };

    return (
        <div className="content">
            <BackButton to={`/history/${id}`} label={workout.name ? workout.name : "Workout"} />

            <h1 className="text-3xl font-semibold mb-10">Workout Stats</h1>

            <section className="grid grid-cols-2 gap-3">
                <StatCard label="Exercises" data={workout.exercises.length} />
                <StatCard label="Total sets" data={totalSets()} />
                <StatCard label="Total reps" data={totalReps()} />
                <StatCard label="Weight lifted" data={totalWeight()} suffix="kg" />
            </section>
        </div>
    );
}
