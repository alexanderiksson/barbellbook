import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import dateConverter from "../utils/dateConverter";

import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import BackButton from "../components/common/BackButton";
import Notice from "../components/common/Notice";
import { ConfirmModal, PromptModal, LogModal } from "../components/common/Modals";
import WorkoutMenu from "../components/pages/Workout/WorkoutMenu";
import ExerciseCard from "../components/pages/Workout/ExerciseCard";
import MenuButton from "../components/common/MenuButton";
import Menu from "../components/common/Menu";

import GymIcon from "../assets/icons/GymIcon";
import { IoIosStats } from "react-icons/io";
import { IoIosList } from "react-icons/io";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";

interface Set {
    reps: number;
    weight: string;
}

interface Exercise {
    name: string;
    sets: Set[];
}

interface Workout {
    name?: string;
    date: string;
    exercises: Exercise[];
    log?: string;
}

export default function WorkoutPage() {
    const [loading, setLoading] = useState<boolean>(true);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const closeMenu = () => setIsOpen(false);

    const [noticeMsg, setNoticeMsg] = useState("");

    const { id } = useParams<{ id: string }>();
    const { workouts, removeWorkout, updateWorkoutName, saveWorkoutLog } = useWorkout();
    const workout: Workout | undefined = workouts.find(
        (_, index) => index === parseInt(id || "", 10)
    );

    const workoutName = workout?.name || "Workout";
    const workoutLog = workout?.log;

    // Trigger to show notice
    const noticeTriggerRef = useRef<() => void | null>(null);

    // Manage ConfirmModal state
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const openConfirmModal = () => setIsConfirmModalOpen(true);
    const closeConfirmModal = () => setIsConfirmModalOpen(false);

    // Manage PromptModal state
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const openPromptModal = () => setIsPromptModalOpen(true);
    const closePromptModal = () => setIsPromptModalOpen(false);

    // Manage LogModal state
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const openLogModal = () => setIsLogModalOpen(true);
    const closeLogModal = () => setIsLogModalOpen(false);

    useEffect(() => {
        if (workouts) {
            setLoading(false);
        }
    }, [workouts]);

    if (loading) {
        return <Loader />;
    }

    if (!workout) {
        return <Error msg="Workout not found" />;
    }

    return (
        <>
            <ConfirmModal
                text="Are you sure you want to delete workout?"
                buttonText="Delete"
                buttonVariant="danger"
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                action={() => {
                    setLoading(true);
                    removeWorkout(Number(id));
                    window.location.href = "/history";
                }}
            />

            <PromptModal
                text="Workout name"
                buttonText="Save changes"
                isOpen={isPromptModalOpen}
                onClose={closePromptModal}
                initialValue={workoutName}
                onSubmit={(value) => {
                    setIsOpen(false);

                    if (value) {
                        updateWorkoutName(Number(id), value);

                        // Trigger the notice
                        if (noticeTriggerRef.current) {
                            setNoticeMsg("Workout name saved");
                            noticeTriggerRef.current();
                        }
                    }
                }}
            />

            <LogModal
                isOpen={isLogModalOpen}
                onClose={closeLogModal}
                initialValue={workoutLog}
                onSubmit={(value) => {
                    setIsOpen(false);

                    if (value) {
                        saveWorkoutLog(Number(id), value);
                    }
                }}
            />

            <div className="content">
                <Notice
                    msg={noticeMsg}
                    registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
                />

                <BackButton to="/history" label="History" />

                <div className="flex justify-between items-center mb-4 gap-2">
                    <div className="flex items-center justify-center gap-4 shrink overflow-hidden">
                        <div className="bg-emerald-500/10 w-16 h-16 flex justify-center items-center rounded-full flex-shrink-0">
                            <GymIcon size="32px" color="#10b981" />
                        </div>
                        <div className="flex flex-col gap-1 overflow-hidden">
                            <h1 className="text-xl font-semibold truncate">{workoutName}</h1>
                            <p className="text-neutral-500 truncate">
                                {dateConverter(workout.date)}
                            </p>
                        </div>
                    </div>

                    <div className="flex relative shrink-0">
                        <MenuButton onClick={() => setIsOpen((isOpen) => !isOpen)} />

                        {isOpen && (
                            <div
                                className="fixed inset-0 z-10 bg-black/50 backdrop-blur-xs"
                                onClick={() => setIsOpen(false)}
                            ></div>
                        )}

                        <Menu
                            isOpen={isOpen}
                            closeMenu={closeMenu}
                            menuItems={[
                                {
                                    type: "function",
                                    label: "Log",
                                    icon: IoIosList,
                                    onClick: openLogModal,
                                },
                                {
                                    type: "link",
                                    label: "Stats",
                                    icon: IoIosStats,
                                    to: `/history/${id}/stats`,
                                },
                                {
                                    type: "function",
                                    label: "Edit name",
                                    icon: BiSolidEditAlt,
                                    onClick: openPromptModal,
                                },
                                {
                                    type: "function",
                                    label: "Delete",
                                    icon: MdDeleteForever,
                                    onClick: openConfirmModal,
                                    danger: true,
                                },
                            ]}
                        />

                        {/* UNUSED COMPONENT */}

                        {/* <WorkoutMenu
                            id={id}
                            isOpen={isOpen}
                            closeMenu={closeMenu}
                            openConfirmModal={openConfirmModal}
                            openPromptModal={openPromptModal}
                            openLogModal={openLogModal}
                        /> */}
                    </div>
                </div>

                <section className="flex flex-col gap-4 mt-8">
                    {workout.exercises.map((exercise, index) => (
                        <ExerciseCard key={index} index={index + 1} exercise={exercise} />
                    ))}
                </section>
            </div>
        </>
    );
}
