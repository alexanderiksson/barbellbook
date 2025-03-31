import { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import RepCounter from "../components/RepCounter";
import WeightInput from "../components/WeightInput";
import SetTable from "../components/SetTable";
import AddIcon from "../assets/icons/AddIcon";

export default function AddExercise() {
    const { addExercise } = useWorkout();

    const [name, setName] = useState("");
    const [sets, setSets] = useState([]);
    const [reps, setReps] = useState(0);
    const [weight, setWeight] = useState(0);

    const removeSet = (index) => {
        setSets((prevSets) => {
            const newSets = [...prevSets];
            newSets.splice(index, 1);
            return newSets;
        });
    };

    return (
        <div className="content flex flex-col gap-8 flex-1">
            <h1 className="text-3xl font-semibold">Add Exercise</h1>

            <label className="w-full">
                <input
                    className="bg-neutral-900 p-2 rounded-lg w-full border border-white/5"
                    type="text"
                    placeholder="Exercise name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </label>

            {/* Add set */}
            <section className="w-full flex flex-col gap-8 bg-neutral-900 border border-white/5 p-4 rounded-lg">
                <div className="flex justify-around">
                    <RepCounter reps={reps} setReps={setReps} />
                    <WeightInput weight={weight} setWeight={setWeight} />
                </div>

                <button
                    className="bg-sky-700 px-4 py-2 rounded-lg inline-flex justify-center items-center gap-2 cursor-pointer"
                    onClick={() => {
                        if (reps == 0 || weight <= 0 || weight > 9999) {
                            alert("Enter weight and reps.");
                        } else {
                            setSets([...sets, { reps: reps, weight: weight }]);
                        }
                    }}
                >
                    <AddIcon size="18px" /> Add set
                </button>
            </section>

            {sets.length > 0 && <SetTable sets={sets} removeSet={removeSet} />}

            <button
                className="bg-emerald-700 px-4 py-2 rounded-lg inline-flex justify-center items-center cursor-pointer mt-auto"
                onClick={() => {
                    if (sets <= 0) {
                        alert("Exercise dosen't have any sets.");
                    } else if (!name) {
                        alert("Enter exercise name.");
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
