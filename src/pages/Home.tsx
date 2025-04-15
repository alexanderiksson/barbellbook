import { useRef, useState } from "react";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import { LinkButton, Button } from "../components/common/Buttons";
import ExerciseCard from "../components/pages/Home/ExerciseCard";
import Notice from "../components/common/Notice";
import { ConfirmModal, PromptModal } from "../components/common/Modals";

import PlusIcon from "../assets/icons/PlusIcon";
import DoneIcon from "../assets/icons/DoneIcon";

export default function Workout() {
    const { exercises, removeExercise, clearExercises, addWorkout } = useWorkout();

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

    return (
        <>
            <ConfirmModal
                text="Do you want to finish & save workout?"
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                action={() => {
                    closeConfirmModal();
                    openPromptModal();
                }}
            />

            <PromptModal
                text="Workout name"
                isOpen={isPromptModalOpen}
                onClose={closePromptModal}
                onSubmit={(value) => {
                    const date = new Date().toLocaleDateString();

                    const newWorkout = {
                        name: value || null,
                        date: date,
                        exercises: [...exercises],
                    };

                    addWorkout(newWorkout);
                    clearExercises();

                    // Trigger the notice
                    if (noticeTriggerRef.current) {
                        noticeTriggerRef.current();
                    }
                }}
            />

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
                                openConfirmModal();
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
        </>
    );
}
