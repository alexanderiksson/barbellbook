import { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";

import { Button } from "../components/common/Buttons";
import RepCounter from "../components/pages/AddExercise/RepCounter";
import WeightInput from "../components/pages/AddExercise/WeightInput";
import SetTable from "../components/pages/AddExercise/SetTable";

interface Set {
    reps: number;
    weight: number;
}

export default function AddExercise() {
    const { addExercise } = useWorkout();

    const [name, setName] = useState<string>("");
    const [sets, setSets] = useState<Set[]>([]);
    const [reps, setReps] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);

    const removeSet = (index: number): void => {
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

                <Button
                    variant={"blue"}
                    onClick={() => {
                        if (reps === 0 || weight <= 0 || weight > 9999) {
                            alert("Enter weight and reps.");
                        } else {
                            setSets([...sets, { reps, weight }]);
                        }
                    }}
                >
                    Add set
                </Button>
            </section>

            {sets.length > 0 && <SetTable sets={sets} removeSet={removeSet} />}

            <Button
                variant={"green"}
                className={"mt-auto"}
                onClick={() => {
                    if (sets.length <= 0) {
                        alert("Exercise doesn't have any sets.");
                    } else if (!name) {
                        alert("Enter exercise name.");
                    } else {
                        const newExercise = {
                            name,
                            sets: [...sets],
                        };
                        addExercise(newExercise);
                        window.location.href = "/";
                    }
                }}
            >
                Save exercise
            </Button>
        </div>
    );
}
