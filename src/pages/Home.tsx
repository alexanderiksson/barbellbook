import { useRef, useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import useModal from "../hooks/useModal";

import PageHeading from "../components/common/PageHeading";
import { LinkButton, Button } from "../components/common/Buttons";
import ExerciseCard from "../components/common/ExerciseCard";
import Notice from "../components/common/Notice";
import { ConfirmModal, PromptModal } from "../components/common/Modals";
import Loader from "../components/common/Loader";

import { IoMdAdd, IoMdCheckmark } from "react-icons/io";

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const { exercises, removeExercise, clearExercises, addWorkout } = useWorkout();

    // Trigger to show notice
    const noticeTriggerRef = useRef<() => void | null>(null);

    // Manage modal state
    const confirmModal = useModal();
    const promptModal = useModal();

    // Show loader if loading
    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <ConfirmModal
                text="Do you want to finish & save workout?"
                buttonText="Save"
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.close}
                action={() => {
                    confirmModal.close();
                    promptModal.open();
                }}
            />

            <PromptModal
                text="Workout name"
                buttonText="Save"
                isOpen={promptModal.isOpen}
                onClose={promptModal.close}
                onSubmit={(value) => {
                    setLoading(true);

                    const date = new Date().toLocaleString();

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
                    <span className="text-sm lg:text-base font-normal block text-text-grey mt-2">
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
                        <Button variant={"green"} onClick={confirmModal.open}>
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
                                index={index}
                                name={exercise.name}
                                sets={exercise.sets}
                                canDelete
                                onDelete={removeExercise}
                            />
                        ))}
                    </section>
                )}
            </div>
        </>
    );
}
