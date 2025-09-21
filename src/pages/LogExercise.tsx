import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { useSettings } from "../context/SettingsContext";
import exercises from "../data/exercises.json";
import { SetType } from "../types/workout";
import useOverlay from "../hooks/useOverlay";

import { Button } from "../components/common/Buttons";
import RepCounter from "../components/pages/LogExercise/RepCounter";
import WeightInput from "../components/pages/LogExercise/WeightInput";
import SetTable from "../components/pages/LogExercise/SetTable";
import Notice from "../components/common/Notice";
import { AlertModal, ConfirmModal, CustomModal } from "../components/common/Modals";
import Loader from "../components/common/Loader";
import { SearchField } from "../components/common/Inputs";
import Header from "../components/layout/Header";
import RestTimer from "../components/pages/LogExercise/RestTimer";
import Menu from "../components/common/Menu";

import { IoMdAdd } from "react-icons/io";
import { MdHistory, MdContentCopy } from "react-icons/md";

export default function LogExercise() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const { weightUnit } = useSettings();

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
    const confirmModal = useOverlay();
    const alertModal = useOverlay();
    const customModal = useOverlay();
    const [modalText, setModalText] = useState("");

    // Manage menu state
    const menu = useOverlay();

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

            <CustomModal
                isOpen={customModal.isOpen}
                onClose={customModal.close}
                text={exercise ? "Previous session" : "No exercise selected"}
            >
                {lastSessionSets ? (
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
                                    <td>
                                        {set.weight}{" "}
                                        <span className="text-[var(--text-grey)]">
                                            {weightUnit}
                                        </span>
                                    </td>
                                    <td
                                        className="py-2 flex justify-center cursor-pointer"
                                        onClick={() => {
                                            setReps(set.reps);
                                            setWeight(set.weight.toString());
                                        }}
                                    >
                                        <MdContentCopy />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    exercise && (
                        <span className="text-[var(--text-grey)]">No previous sessions found</span>
                    )
                )}
            </CustomModal>

            <div className="content flex flex-col flex-1">
                <Header
                    title="Log exercise"
                    menuOnClick={() => (menu.isOpen ? menu.close() : menu.open())}
                />

                <Menu
                    isOpen={menu.isOpen}
                    closeMenu={menu.close}
                    spacingTop
                    menuItems={[
                        {
                            type: "function",
                            label: "Previous session",
                            icon: MdHistory,
                            onClick: customModal.open,
                        },
                    ]}
                />

                <Notice
                    msg="Set added"
                    registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
                />

                <div className="flex flex-col gap-4 flex-1 mb-4">
                    <div className="relative">
                        <SearchField
                            placeholder="Search exercise..."
                            value={search}
                            onClear={() => {
                                setSearch("");
                                setExercise(undefined);
                                setNameListOpen(false);
                            }}
                            onChange={(e) => {
                                setSearch(e.target.value);

                                if (e.target.value) {
                                    setNameListOpen(true);
                                } else {
                                    setNameListOpen(false);
                                }
                            }}
                        />

                        {nameListOpen && (
                            <ul
                                className={`absolute bg-[var(--secondary-bright)]/70 backdrop-blur-xl rounded-[var(--radius)] shadow-xl w-full mt-2 max-h-64 overflow-y-auto z-10 divide-y divide-white/10`}
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

                    <section className="w-full flex flex-col gap-6 bg-[var(--secondary)] border border-[var(--border)]/20 rounded-[var(--radius)] p-4">
                        <div className="flex justify-around gap-4 flex-wrap-reverse">
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

                    <RestTimer />

                    {currentSets.length > 0 && (
                        <SetTable currentSets={currentSets} removeCurrentSets={removeCurrentSets} />
                    )}
                </div>

                <Button
                    variant={"green"}
                    className={"mt-auto"}
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
