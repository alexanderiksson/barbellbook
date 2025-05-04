import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import dateConverter from "../utils/dateConverter";

import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import BackButton from "../components/common/BackButton";
import Notice from "../components/common/Notice";
import { ConfirmModal, PromptModal } from "../components/common/Modals";
import WorkoutMenu from "../components/pages/Workout/WorkoutMenu";
import ExerciseCard from "../components/pages/Workout/ExerciseCard";

import GymIcon from "../assets/icons/GymIcon";
import { HiDotsHorizontal } from "react-icons/hi";

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
}

export default function WorkoutPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { id } = useParams<{ id: string }>();
    const { workouts, removeWorkout, updateWorkoutName } = useWorkout();
    const workout: Workout | undefined = workouts.find(
        (_, index) => index === parseInt(id || "", 10)
    );

    const workoutName = workout?.name || "Workout";

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
                buttonText="Save"
                isOpen={isPromptModalOpen}
                onClose={closePromptModal}
                initialValue={workoutName}
                onSubmit={(value) => {
                    setIsOpen(false);

                    if (value) {
                        updateWorkoutName(Number(id), value);

                        // Trigger the notice
                        if (noticeTriggerRef.current) {
                            noticeTriggerRef.current();
                        }
                    }
                }}
            />

            <div className="content">
                <Notice
                    msg="Workout name saved"
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

                    <div className="flex gap-2 relative shrink-0">
                        <button
                            className="bg-neutral-800 w-11 h-11 rounded-xl inline-flex justify-center items-center cursor-pointer"
                            onClick={() => setIsOpen((isOpen) => !isOpen)}
                        >
                            <HiDotsHorizontal size={20} />
                        </button>

                        {isOpen && (
                            <div
                                className="fixed inset-0 z-10 bg-black/30"
                                onClick={() => setIsOpen(false)}
                            ></div>
                        )}

                        <WorkoutMenu
                            id={id}
                            isOpen={isOpen}
                            openConfirmModal={openConfirmModal}
                            openPromptModal={openPromptModal}
                        />
                    </div>
                </div>

                <section className="flex flex-col gap-4 mt-8">
                    {workout.exercises.map((exercise, index) => (
                        <ExerciseCard index={index + 1} exercise={exercise} />
                    ))}
                </section>
            </div>
        </>
    );
}
