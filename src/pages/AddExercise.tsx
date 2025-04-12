import { useState, useRef } from "react";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import { Button } from "../components/common/Buttons";
import RepCounter from "../components/pages/AddExercise/RepCounter";
import WeightInput from "../components/pages/AddExercise/WeightInput";
import SetTable from "../components/pages/AddExercise/SetTable";
import Notice from "../components/common/Notice";

import PlusIcon from "../assets/icons/PlusIcon";

export default function AddExercise() {
    const { addExercise, currentSets, saveCurrentSets, removeCurrentSets, clearCurrentSets } =
        useWorkout();

    const [name, setName] = useState<string>("");
    const [reps, setReps] = useState<number>(0);
    const [weight, setWeight] = useState<number | "">("");

    // Trigger to show notice
    const noticeTriggerRef = useRef<() => void | null>(null);

    return (
        <div className="content flex flex-col flex-1">
            <Notice
                msg="Set added"
                registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
            />

            <PageHeading>Add Exercise</PageHeading>

            <div className="flex flex-col gap-6 flex-1 mb-4">
                {/* Name input */}
                <input
                    className="bg-neutral-900 p-3 rounded-xl w-full border border-white/5 shadow placeholder:text-neutral-600"
                    type="text"
                    placeholder="Exercise name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />

                {/* Add set */}
                <section className="w-full flex flex-col gap-8 bg-neutral-900 border-t border-white/5 p-4 rounded-xl shadow">
                    <div className="flex justify-around gap-4 flex-wrap-reverse">
                        <RepCounter reps={reps} setReps={setReps} />
                        <WeightInput weight={weight} setWeight={setWeight} />
                    </div>

                    <Button
                        variant={"outline"}
                        onClick={() => {
                            if (reps === 0 || weight === "" || weight <= 0 || weight > 9999) {
                                alert("Enter weight and reps.");
                            } else {
                                saveCurrentSets({
                                    reps: reps,
                                    weight: weight,
                                });

                                // Trigger the notice
                                if (noticeTriggerRef.current) {
                                    noticeTriggerRef.current();
                                }
                            }
                        }}
                    >
                        <PlusIcon /> Add set
                    </Button>
                </section>

                {/* Sets table */}
                {currentSets.length > 0 && (
                    <SetTable currentSets={currentSets} removeCurrentSets={removeCurrentSets} />
                )}
            </div>

            {/* Save exercise button */}
            <Button
                variant={"green"}
                className={"mt-auto w-full"}
                onClick={() => {
                    if (currentSets.length <= 0) {
                        alert("Exercise doesn't have any sets.");
                    } else if (!name) {
                        alert("Enter exercise name.");
                    } else {
                        const newExercise = {
                            name,
                            sets: [...currentSets],
                        };
                        addExercise(newExercise);
                        clearCurrentSets();
                        window.location.href = "/";
                    }
                }}
            >
                Save exercise
            </Button>
        </div>
    );
}
