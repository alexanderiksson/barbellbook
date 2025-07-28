import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import exercises from "../data/exercises.json";
import { SetType } from "../types/workout";
import { motion, AnimatePresence } from "framer-motion";

import PageHeading from "../components/common/PageHeading";
import { Button } from "../components/common/Buttons";
import RepCounter from "../components/pages/AddExercise/RepCounter";
import WeightInput from "../components/pages/AddExercise/WeightInput";
import SetTable from "../components/pages/AddExercise/SetTable";
import Notice from "../components/common/Notice";
import { AlertModal } from "../components/common/Modals";
import Loader from "../components/common/Loader";
import { TextInput } from "../components/common/Inputs";

import { IoMdAdd, IoIosArrowDown } from "react-icons/io";

export default function AddExercise() {
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
    const [lastSessionOpen, setLastSessionOpen] = useState(false);

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("");
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <AlertModal text={modalText} isOpen={isModalOpen} onClose={closeModal} />

            <div className="content flex flex-col flex-1">
                <Notice
                    msg="Set added"
                    registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
                />

                <PageHeading>Add Exercise</PageHeading>

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
                                className={`absolute bg-secondary-bright/70 backdrop-blur-xl rounded-2xl shadow-xl w-full mt-2 max-h-64 overflow-y-auto z-10 divide-y divide-white/10`}
                            >
                                {exercises
                                    .filter((exercise) =>
                                        exercise.name.toLowerCase().includes(search.toLowerCase())
                                    )
                                    .map((exercise) => (
                                        <li
                                            key={exercise.id}
                                            className="p-3 hover:bg-secondary-bright cursor-pointer transition-all duration-100"
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
                    <section className="w-full flex flex-col gap-8 bg-secondary border border-border/20 rounded-2xl p-4">
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
                                    setModalText("Enter weight and reps");
                                    openModal();
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
                            <IoMdAdd size={20} /> Add set
                        </Button>
                    </section>

                    {exercise && lastSessionSets && (
                        <section className="bg-secondary border border-border/20 rounded-2xl p-4 text-sm">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => setLastSessionOpen(!lastSessionOpen)}
                            >
                                <h2 className="text-text-grey text-sm">Previous session</h2>
                                <IoIosArrowDown
                                    size={20}
                                    color="grey"
                                    className={`transition-all ${
                                        !lastSessionOpen ? "-rotate-90" : ""
                                    }`}
                                />
                            </div>
                            <AnimatePresence initial={false}>
                                {lastSessionOpen && (
                                    <motion.div
                                        key="last-session-table"
                                        initial={{ maxHeight: 0 }}
                                        animate={{ maxHeight: 300 }}
                                        exit={{ maxHeight: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <table className="w-full mt-4">
                                            <thead>
                                                <tr className="text-left">
                                                    <th>Set</th>
                                                    <th>Reps</th>
                                                    <th>Weight</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lastSessionSets.map((set, index) => (
                                                    <tr key={index}>
                                                        <td>Set {index + 1}</td>
                                                        <td>{set.reps}</td>
                                                        <td>{set.weight}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    )}

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
                            setModalText("Exercise doesn't have any sets");
                            openModal();
                        } else if (!exercise) {
                            setModalText("Select exercise");
                            openModal();
                        } else {
                            setLoading(true);
                            const newExercise = {
                                id: exercise.id,
                                name: exercise.name,
                                sets: [...currentSets],
                            };
                            addExercise(newExercise);
                            clearCurrentSets();
                            navigate("/");
                        }
                    }}
                >
                    Save exercise
                </Button>
            </div>
        </>
    );
}
