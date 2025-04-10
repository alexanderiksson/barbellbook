import { Link, useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import ArrowIcon from "../assets/icons/ArrowIcon";

// Define types for Set, Exercise, and Workout
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
            <Link className="mb-4 inline-flex items-center py-2 text-sky-500" to={`/history/${id}`}>
                <ArrowIcon color="#0ea5e9" size="32px" />
                {workout.name ? workout.name : "Workout"}
            </Link>
            <h1 className="text-3xl font-semibold mb-10">Workout Stats</h1>

            <section className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-neutral-900 border border-white/5 rounded-lg shadow-xl flex flex-col justify-center items-center text-center">
                    <h2 className="mb-2">Exercises</h2>
                    <span className="text-2xl py-4">{workout.exercises.length}</span>
                </div>
                <div className="p-4 bg-neutral-900 border border-white/5 rounded-lg shadow-xl flex flex-col justify-center items-center text-center">
                    <h2 className="mb-2">Total sets</h2>
                    <span className="text-2xl py-4">{totalSets()}</span>
                </div>
                <div className="p-4 bg-neutral-900 border border-white/5 rounded-lg shadow-xl flex flex-col justify-center items-center text-center">
                    <h2 className="mb-2">Total reps</h2>
                    <span className="text-2xl py-4">{totalReps()}</span>
                </div>
                <div className="p-4 bg-neutral-900 border border-white/5 rounded-lg shadow-xl flex flex-col justify-center items-center text-center">
                    <h2 className="mb-2">Weight lifted</h2>
                    <span className="text-2xl py-4">
                        {totalWeight()} <span className="text-base text-neutral-500">kg</span>
                    </span>
                </div>
            </section>
        </div>
    );
}
