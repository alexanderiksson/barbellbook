import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { WorkoutType } from "../types/workout";
import dateConverter from "../utils/dateConverter";
import { useTabNavigation } from "../hooks/useTabNavigation";

import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import Notice from "../components/common/Notice";
import { ConfirmModal, PromptModal } from "../components/common/Modals";
import ExerciseCard from "../components/common/ExerciseCard";
import Menu from "../components/common/Menu";
import TabNavigation from "../components/common/TabNavigation";
import useOverlay from "../hooks/useOverlay";
import Details from "../components/pages/Workout/Details";
import Log from "../components/pages/Workout/Log";
import Header from "../components/layout/Header";

import { BiSolidEditAlt } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";

export default function WorkoutPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);

    // Manage tab changes
    const validTabs = ["details", "exercises", "log"] as const;
    const { activeTab, handleTabChange } = useTabNavigation("exercises", validTabs);

    const [noticeMsg, setNoticeMsg] = useState("");

    const { id } = useParams<{ id: string }>();
    const { workouts, removeWorkout, updateWorkoutName } = useWorkout();
    const workout: WorkoutType | undefined = workouts.find(
        (_, index) => index === parseInt(id || "", 10)
    );

    // Show error if no workout is found
    if (!workout) return <Error msg="Workout not found" />;

    const workoutName = workout.name || "Workout";
    const workoutLog = workout.log;

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

    // Manage modal state
    const confirmModal = useOverlay();
    const promptModal = useOverlay();

    // Manage menu state
    const menu = useOverlay();

    // Disable loader when the workout are found
    useEffect(() => {
        if (workout) setLoading(false);
    }, [workouts]);

    // Show loader if loading
    if (loading) return <Loader />;

    return (
        <>
            <ConfirmModal
                text="Are you sure you want to delete workout?"
                buttonText="Delete"
                buttonVariant="danger"
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.close}
                action={() => {
                    setLoading(true);
                    removeWorkout(Number(id));
                    confirmModal.close();
                    navigate("/history");
                }}
            />

            <PromptModal
                text="Workout name"
                buttonText="Save changes"
                buttonVariant="green"
                isOpen={promptModal.isOpen}
                onClose={promptModal.close}
                initialValue={workoutName}
                onSubmit={(value) => {
                    menu.close();

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

            <div className="content">
                <Header
                    title={new Date(workout.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                    })}
                    backLink="/history"
                    menuOnClick={() => (menu.isOpen ? menu.close() : menu.open())}
                />

                <Menu
                    isOpen={menu.isOpen}
                    closeMenu={menu.close}
                    spacingTop
                    menuItems={[
                        {
                            type: "function",
                            label: "Edit name",
                            icon: BiSolidEditAlt,
                            onClick: promptModal.open,
                        },
                        {
                            type: "function",
                            label: "Delete",
                            icon: MdDeleteForever,
                            onClick: confirmModal.open,
                            danger: true,
                        },
                    ]}
                />

                <Notice
                    msg={noticeMsg}
                    registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
                />

                <div className="flex flex-col gap-2 overflow-hidden mb-6">
                    <h1 className="text-xl lg:text-2xl font-semibold truncate">{workoutName}</h1>
                    <span className="text-sm text-[var(--text-grey)] flex flex-col lg:flex-row lg:gap-2">
                        <span className="truncate">{dateConverter(workout.date)}</span>
                        <span className="truncate">{workoutTime()}</span>
                    </span>
                </div>

                <TabNavigation
                    tabs={[
                        { id: "exercises", label: "Exercises" },
                        { id: "details", label: "Details" },
                        { id: "log", label: "Log" },
                    ]}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {activeTab === "exercises" && (
                    <section id="exercises">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {workout.exercises.map((exercise, index) => (
                                <ExerciseCard
                                    key={index}
                                    index={index}
                                    name={exercise.name}
                                    sets={exercise.sets}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "details" && (
                    <section id="details">
                        <Details id={id} />
                    </section>
                )}

                {activeTab === "log" && (
                    <section id="log">
                        <Log workoutId={Number(id)} log={workoutLog} />
                    </section>
                )}
            </div>
        </>
    );
}
