import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import exercises from "../data/exercises.json";

import PageHeading from "../components/common/PageHeading";
import { Button } from "../components/common/Buttons";
import RepCounter from "../components/pages/AddExercise/RepCounter";
import WeightInput from "../components/pages/AddExercise/WeightInput";
import SetTable from "../components/pages/AddExercise/SetTable";
import Notice from "../components/common/Notice";
import { AlertModal } from "../components/common/Modals";
import Loader from "../components/common/Loader";
import { TextInput } from "../components/common/Inputs";

import { IoMdAdd } from "react-icons/io";

export default function AddExercise() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const { addExercise, currentSets, saveCurrentSets, removeCurrentSets, clearCurrentSets } =
        useWorkout();

    const [nameListOpen, setNameListOpen] = useState(false);

    const [name, setName] = useState<string>("");
    const [reps, setReps] = useState<number>(0);
    const [weight, setWeight] = useState<string>("");

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
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);

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
                                        exercise.name.toLowerCase().includes(name.toLowerCase())
                                    )
                                    .map((exercise, index) => (
                                        <li
                                            key={index}
                                            className="p-3 hover:bg-secondary-bright cursor-pointer transition-all duration-100"
                                            onClick={() => {
                                                setName(exercise.name);
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
                        } else if (!name) {
                            setModalText("Enter exercise name");
                            openModal();
                        } else {
                            setLoading(true);
                            const newExercise = {
                                name,
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
