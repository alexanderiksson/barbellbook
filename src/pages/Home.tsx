import { useRef, useState } from "react";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import { LinkButton, Button } from "../components/common/Buttons";
import ExerciseCard from "../components/pages/Home/ExerciseCard";
import Notice from "../components/common/Notice";
import { ConfirmModal, PromptModal } from "../components/common/Modals";
import Loader from "../components/common/Loader";

import { IoMdAdd, IoMdCheckmark } from "react-icons/io";

export default function Workout() {
    const [loading, setLoading] = useState<boolean>(false);

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

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <ConfirmModal
                text="Do you want to finish & save workout?"
                buttonText="Save"
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                action={() => {
                    closeConfirmModal();
                    openPromptModal();
                }}
            />

            <PromptModal
                text="Workout name"
                buttonText="Save"
                isOpen={isPromptModalOpen}
                onClose={closePromptModal}
                onSubmit={(value) => {
                    setLoading(true);

                    const date = new Date().toLocaleDateString();

                    const newWorkout = {
                        name: value || null,
                        date,
                        exercises: [...exercises],
                    };

                    addWorkout(newWorkout);
                    clearExercises();

                    setLoading(false);

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

                <PageHeading>
                    Today's Workout
                    <span className="text-base font-normal block text-neutral-500 mt-2">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </PageHeading>

                <div className="flex justify-between flex-wrap gap-2 mb-8 mt-8">
                    <LinkButton to="/add-exercise" variant={"outline"}>
                        <IoMdAdd size={20} /> Add exercise
                    </LinkButton>

                    {exercises.length > 0 && (
                        <Button
                            variant={"green"}
                            onClick={() => {
                                openConfirmModal();
                            }}
                        >
                            <IoMdCheckmark size={20} />
                            Finish
                        </Button>
                    )}
                </div>

                {exercises.length > 0 && (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {exercises.map((exercise, index) => (
                            <ExerciseCard
                                key={index}
                                exercise={exercise}
                                index={index}
                                removeExercise={removeExercise}
                            />
                        ))}
                    </section>
                )}
            </div>
        </>
    );
}
