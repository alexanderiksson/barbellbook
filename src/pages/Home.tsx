import { useRef } from "react";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import { LinkButton, Button } from "../components/common/Buttons";
import ExerciseCard from "../components/pages/Home/ExerciseCard";
import Notice from "../components/common/Notice";

import PlusIcon from "../assets/icons/PlusIcon";
import DoneIcon from "../assets/icons/DoneIcon";

interface Set {
    reps: number;
    weight: number;
}

interface Exercise {
    name: string;
    sets: Set[];
}

export default function Workout() {
    const { exercises, removeExercise, clearExercises, addWorkout } = useWorkout() as {
        exercises: Exercise[];
        removeExercise: (index: number) => void;
        clearExercises: () => void;
        addWorkout: (workout: {
            name?: string | null;
            date: string;
            exercises: Exercise[];
        }) => void;
    };

    // Trigger to show notice
    const noticeTriggerRef = useRef<() => void | null>(null);

    return (
        <div className="content">
            <Notice
                msg="Workout saved!"
                registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
            />
            <PageHeading>Today's Workout</PageHeading>

            <div className="flex justify-between flex-wrap gap-2 mb-12">
                <LinkButton to="/add-exercise" variant={"outline"}>
                    <PlusIcon /> Add exercise
                </LinkButton>

                {exercises.length > 0 && (
                    <Button
                        variant={"green"}
                        onClick={() => {
                            if (confirm("Do you want to finish & save workout?")) {
                                const name = prompt("Workout name (optional)");
                                const date = new Date().toLocaleDateString();

                                const newWorkout = {
                                    name: name || null,
                                    date: date,
                                    exercises: [...exercises],
                                };

                                addWorkout(newWorkout);
                                clearExercises();
                                // Trigger the notice
                                if (noticeTriggerRef.current) {
                                    noticeTriggerRef.current();
                                }
                            }
                        }}
                    >
                        <DoneIcon />
                        Finish
                    </Button>
                )}
            </div>

            {exercises.length === 0 ? (
                <p className="text-neutral-500">Get started by adding an exercise.</p>
            ) : (
                <>
                    <section className="flex flex-col gap-4">
                        {exercises.map((exercise, index) => (
                            <ExerciseCard
                                key={index}
                                exercise={exercise}
                                index={index}
                                removeExercise={removeExercise}
                            />
                        ))}
                    </section>
                </>
            )}
        </div>
    );
}
