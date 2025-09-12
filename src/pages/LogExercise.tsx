import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import exercises from "../data/exercises.json";
import { SetType } from "../types/workout";
import useModal from "../hooks/useModal";

import { Button } from "../components/common/Buttons";
import RepCounter from "../components/pages/LogExercise/RepCounter";
import WeightInput from "../components/pages/LogExercise/WeightInput";
import SetTable from "../components/pages/LogExercise/SetTable";
import Notice from "../components/common/Notice";
import { AlertModal, ConfirmModal } from "../components/common/Modals";
import Loader from "../components/common/Loader";
import { TextInput } from "../components/common/Inputs";
import PreviousSession from "../components/pages/LogExercise/PreviousSession";
import Header from "../components/layout/Header";

import { IoMdAdd } from "react-icons/io";

export default function LogExercise() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const {
        addExercise,
        currentSets,
        saveCurrentSets,
        removeCurrentSets,
        clearCurrentSets,
        workouts,
    } = useWorkout();

    const [nameListOpen, setNameListOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [exercise, setExercise] = useState<{ id: number; name: string }>();
    const [reps, setReps] = useState<number>(0);
    const [weight, setWeight] = useState<string>("");
    const [lastSessionSets, setLastSessionSets] = useState<SetType[] | null>(null);

    // Find previously logged sets
    useEffect(() => {
        if (!exercise) {
            setLastSessionSets(null);
            return;
        }

        const sortedWorkouts = [...workouts].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const lastWorkoutWithExercise = sortedWorkouts.find((workout) =>
            workout.exercises.some((ex) => ex.name === exercise.name)
        );
        if (lastWorkoutWithExercise) {
            const foundExercise = lastWorkoutWithExercise.exercises.find(
                (ex) => ex.name === exercise.name
            );
            setLastSessionSets(foundExercise ? foundExercise.sets : null);
        } else {
            setLastSessionSets(null);
        }
    }, [exercise, workouts]);

    // Trigger to show notice
    const noticeTriggerRef = useRef<() => void | null>(null);

    // Manage modal state
    const confirmModal = useModal();
    const alertModal = useModal();
    const [modalText, setModalText] = useState("");

    // Show loader if loading
    if (loading) return <Loader />;

    return (
        <>
            <AlertModal text={modalText} isOpen={alertModal.isOpen} onClose={alertModal.close} />
            <ConfirmModal
                text="Do you want to save?"
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.close}
                buttonText="Save exercise"
                buttonVariant="green"
                action={() => {
                    setLoading(true);

                    if (!exercise) {
                        setLoading(false);
                        return;
                    }

                    const newExercise = {
                        id: exercise.id,
                        name: exercise.name,
                        sets: [...currentSets],
                    };

                    addExercise(newExercise);

                    clearCurrentSets();
                    navigate("/");
                }}
            />

            <div className="content flex flex-col flex-1">
                <Header title="Log exercise" />

                <Notice
                    msg="Set added"
                    registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
                />

                <div className="flex flex-col gap-4 flex-1 mb-4">
                    <div className="relative">
                        <TextInput
                            placeholder="Search exercise..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);

                                if (e.target.value.length > 0) {
                                    setNameListOpen(true);
                                } else {
                                    setNameListOpen(false);
                                }
                            }}
                        />

                        {nameListOpen && (
                            <ul
                                className={`absolute bg-[var(--secondary-bright)]/70 backdrop-blur-xl rounded-2xl shadow-xl w-full mt-2 max-h-64 overflow-y-auto z-10 divide-y divide-white/10`}
                            >
                                {exercises
                                    .filter((exercise) =>
                                        exercise.name.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((exercise) => (
                                        <li
                                            key={exercise.id}
                                            className="p-3 hover:bg-[var(--secondary-bright)] cursor-pointer transition-all duration-100"
                                            onClick={() => {
                                                setSearch(exercise.name);
                                                setExercise({
                                                    id: exercise.id,
                                                    name: exercise.name,
                                                });
                                                setNameListOpen(false);
                                            }}
                                        >
                                            {exercise.name}
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>

                    {/* Add set */}
                    <section className="w-full flex flex-col gap-8 bg-[var(--secondary)] border border-[var(--border)]/20 rounded-2xl p-4">
                        <div className="flex justify-around gap-6 flex-wrap-reverse">
                            <RepCounter reps={reps} setReps={setReps} />
                            <WeightInput weight={weight} setWeight={setWeight} />
                        </div>

                        <Button
                            variant={"outline"}
                            onClick={() => {
                                if (
                                    reps === 0 ||
                                    weight === "" ||
                                    weight <= "0" ||
                                    weight > "9999"
                                ) {
                                    setModalText(
                                        "Please enter both weight and reps to add your set."
                                    );
                                    alertModal.open();
                                } else {
                                    saveCurrentSets({
                                        reps: reps,
                                        weight: Number(weight),
                                        time: new Date().toLocaleTimeString(),
                                    });

                                    // Trigger the notice
                                    if (noticeTriggerRef.current) {
                                        noticeTriggerRef.current();
                                    }
                                }
                            }}
                        >
                            <IoMdAdd size={20} /> Add set
                        </Button>
                    </section>

                    {lastSessionSets && <PreviousSession sets={lastSessionSets} />}

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
                            setModalText(
                                "Please add at least one set before saving your exercise."
                            );
                            alertModal.open();
                        } else if (!exercise) {
                            setModalText("Please select an exercise.");
                            alertModal.open();
                        } else {
                            confirmModal.open();
                        }
                    }}
                >
                    Save exercise
                </Button>
            </div>
        </>
    );
}
