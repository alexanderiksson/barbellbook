import { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import RepCounter from "../components/RepCounter";
import WeightInput from "../components/WeightInput";
import SetTable from "../components/SetTable";

export default function AddExercise() {
    const { addExercise } = useWorkout();

    const [name, setName] = useState("");
    const [sets, setSets] = useState([]);
    const [reps, setReps] = useState(0);
    const [weight, setWeight] = useState(0);

    return (
        <div className="content flex flex-col gap-8 pb-12">
            <h1 className="text-3xl font-semibold">New exercise</h1>

            <label className="w-full">
                <input
                    className="bg-neutral-800 p-2 rounded w-full border border-white/10"
                    type="text"
                    placeholder="Exercise name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </label>

            {/* Add set */}
            <section className="w-full flex flex-col gap-8 bg-neutral-900 border border-white/10 p-4 rounded">
                <div className="flex justify-around">
                    <RepCounter reps={reps} setReps={setReps} />
                    <WeightInput weight={weight} setWeight={setWeight} />
                </div>

                <button
                    className="bg-slate-600 px-4 py-2 rounded inline-flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        if (reps == 0 || weight == 0) {
                            alert("Enter weight and reps");
                        } else {
                            setSets([...sets, { reps: reps, weight: weight }]);
                            setReps(0);
                        }
                    }}
                >
                    + Add set
                </button>
            </section>

            {sets.length > 0 && <SetTable sets={sets} />}

            <button
                className="bg-green-600 px-4 py-2 rounded inline-flex justify-center items-center cursor-pointer"
                onClick={() => {
                    if (sets <= 0) {
                        alert("You have no sets");
                    } else if (!name) {
                        alert("Enter exercise name");
                    } else {
                        const newExercise = {
                            name: name,
                            sets: [...sets],
                        };
                        addExercise(newExercise);
                        window.location.href = "/";
                    }
                }}
            >
                Save exercise
            </button>
        </div>
    );
}
