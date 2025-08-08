import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { WorkoutType } from "../types/workout";
import dateConverter from "../utils/dateConverter";

import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import BackButton from "../components/common/BackButton";
import Notice from "../components/common/Notice";
import { ConfirmModal, PromptModal, LogModal } from "../components/common/Modals";
import ExerciseCard from "../components/pages/Workout/ExerciseCard";
import MenuButton from "../components/common/MenuButton";
import Menu from "../components/common/Menu";
import Stats from "../components/pages/Workout/Stats";

import GymIcon from "../assets/icons/GymIcon";
import { IoIosList } from "react-icons/io";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";

export default function WorkoutPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const closeMenu = () => setIsOpen(false);

    const [noticeMsg, setNoticeMsg] = useState("");

    const { id } = useParams<{ id: string }>();
    const { workouts, removeWorkout, updateWorkoutName, saveWorkoutLog } = useWorkout();
    const workout: WorkoutType | undefined = workouts.find(
        (_, index) => index === parseInt(id || "", 10)
    );

    const workoutName = workout?.name || "Workout";
    const workoutLog = workout?.log;

    // Find workout time
    const workoutTime = (): string | null => {
        const firstSet = workout?.exercises[0]?.sets?.[0];
        const lastExercise = workout?.exercises[workout.exercises.length - 1];
        const lastSet = lastExercise?.sets?.[lastExercise.sets.length - 1];

        const rawStartTime = firstSet?.time;
        const rawEndTime = lastSet?.time;

        if (!rawStartTime || !rawEndTime) return null;

        const formatTime = (time: string) => {
            const [hourStr, minuteStr] = time.split(":");
            const formattedTime = `${hourStr.padStart(2, "0")}:${minuteStr.padStart(2, "0")}`;
            return formattedTime;
        };

        return `${formatTime(rawStartTime)} - ${formatTime(rawEndTime)}`;
    };

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

    // Disable loader when the workout are found
    useEffect(() => {
        if (workout) {
            setLoading(false);
        }
    }, [workouts]);

    // Show loader if loading
    if (loading) {
        return <Loader />;
    }

    // Show error if no workout is found
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
                    closeConfirmModal();
                    navigate("/history");
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

                <BackButton to="/history" label="Workout history" />

                <div className="flex justify-between items-center mb-6 gap-2">
                    <div className="flex items-center justify-center gap-2 shrink overflow-hidden">
                        <div className="bg-accent-bright/10 flex justify-center items-center rounded-full flex-shrink-0 aspect-square w-14">
                            <GymIcon
                                size="28px"
                                color={getComputedStyle(document.documentElement).getPropertyValue(
                                    "--color-accent-bright"
                                )}
                            />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-xl lg:text-2xl font-semibold truncate">
                                {workoutName}
                            </h1>
                            <span className="text-sm lg:text-base text-text-grey flex flex-col lg:flex-row lg:gap-2">
                                <span className="truncate">{dateConverter(workout.date)}</span>
                                <span className="truncate">{workoutTime()}</span>
                            </span>
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
                    </div>
                </div>

                <section id="details">
                    <Stats id={id} />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4" id="exercises">
                    {workout.exercises.map((exercise, index) => (
                        <ExerciseCard key={index} index={index + 1} exercise={exercise} />
                    ))}
                </section>
            </div>
        </>
    );
}
