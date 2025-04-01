import { Link } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { useParams } from "react-router-dom";
import ArrowIcon from "../assets/icons/ArrowIcon";

export default function WorkoutStats() {
    const { id } = useParams();
    const { workouts } = useWorkout();

    const workout = workouts.find((_, index) => index === parseInt(id, 10));

    const totalSets = () => {
        let sets = 0;
        for (let i = 0; i < workout.exercises.length; i++) {
            sets += workout.exercises[i].sets.length;
        }
        return sets;
    };

    const totalReps = () => {
        let reps = 0;
        for (let i = 0; i < workout.exercises.length; i++) {
            for (let s = 0; s < workout.exercises[i].sets.length; s++) {
                reps += workout.exercises[i].sets[s].reps;
            }
        }
        return reps;
    };

    const totalWeight = () => {
        let weight = 0;
        for (let i = 0; i < workout.exercises.length; i++) {
            for (let s = 0; s < workout.exercises[i].sets.length; s++) {
                weight +=
                    workout.exercises[i].sets[s].weight *
                    workout.exercises[i].sets[s].reps;
            }
        }
        return weight;
    };

    return (
        <div className="content">
            <Link
                className="mb-4 inline-flex py-2 text-sky-500"
                to={`/history/${id}`}
            >
                <ArrowIcon color="#0ea5e9" />
                {workout.name ? workout.name : "Workout"}
            </Link>
            <h1 className="text-3xl font-semibold mb-10">Workout Stats</h1>

            <section className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-neutral-900 border border-white/5 rounded-lg shadow-xl flex flex-col justify-center items-center text-center">
                    <h2 className="mb-2">Exercises</h2>
                    <span className="text-2xl py-4">
                        {workout.exercises.length}
                    </span>
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
                        {totalWeight()}{" "}
                        <span className="text-base text-neutral-500">kg</span>
                    </span>
                </div>
            </section>
        </div>
    );
}
