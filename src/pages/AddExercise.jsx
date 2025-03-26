import { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import RepCounter from "../components/RepCounter";
import WeightInput from "../components/WeightInput";
import SetTable from "../components/SetTable";
import { Link } from "react-router-dom";

export default function AddExercise() {
    const { addExercise } = useWorkout();

    const [name, setName] = useState("");
    const [sets, setSets] = useState([]);
    const [reps, setReps] = useState(0);
    const [weight, setWeight] = useState(0);

    return (
        <div className="content flex flex-col justify-center items-center min-h-screen gap-16 pb-12">
            <div className="w-full flex justify-start">
                <Link
                    to="/workout"
                    className="bg-neutral-600 pl-1 pr-2 py-1 rounded text-neutral-200"
                >
                    &lt; back
                </Link>
            </div>

            <h1 className="text-3xl font-semibold">New exercise</h1>

            <label className="w-full max-w-lg">
                <input
                    className="bg-neutral-800 p-2 rounded w-full border border-white/10"
                    type="text"
                    placeholder="Exercise name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </label>

            <RepCounter reps={reps} setReps={setReps} />

            <WeightInput weight={weight} setWeight={setWeight} />

            <button
                className="bg-green-600 px-4 py-2 rounded inline-flex justify-center items-center cursor-pointer"
                onClick={() => {
                    setSets([...sets, { reps: reps, weight: weight }]);
                    setReps(0);
                }}
            >
                Add set
            </button>

            {sets.length > 0 && <SetTable sets={sets} />}

            <Link
                className="bg-green-600 px-4 py-2 rounded inline-flex justify-center items-center cursor-pointer"
                onClick={() => {
                    const newExercise = {
                        name: name,
                        sets: [...sets],
                    };
                    addExercise(newExercise);
                    setName("");
                    setSets([]);
                    setReps(0);
                    setWeight(0);
                }}
                to="/workout"
            >
                Save exercise
            </Link>
        </div>
    );
}
