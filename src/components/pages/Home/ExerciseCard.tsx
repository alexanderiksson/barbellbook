import { useState } from "react";
import { ExerciseType } from "../../../types/workout";
import { ConfirmModal } from "../../common/Modals";
import { MdDeleteForever } from "react-icons/md";

interface ExerciseCardProps {
    exercise: ExerciseType;
    index: number;
    removeExercise: (index: number) => void;
}

export default function ExerciseCard({ exercise, index, removeExercise }: ExerciseCardProps) {
    // Manage modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [removeIndex, setRemoveIndex] = useState(0);

    return (
        <>
            <ConfirmModal
                text="Are you sure you want to delete exercise?"
                buttonText="Delete"
                buttonVariant="danger"
                isOpen={isModalOpen}
                onClose={closeModal}
                action={() => removeExercise(removeIndex)}
            />

            <div className="p-4 bg-zinc-900 border border-white/3 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-6">
                    <h2 className="text-lg font-medium truncate">
                        <span className="mr-2 text-neutral-500">#{index + 1}</span>
                        {exercise.name}
                    </h2>
                    <button
                        className="cursor-pointer"
                        onClick={() => {
                            setRemoveIndex(index);
                            openModal();
                        }}
                    >
                        <MdDeleteForever color="#dc2626" size={24} />
                    </button>
                </div>

                <table className="w-full mb-4">
                    <thead>
                        <tr className="text-left">
                            <th>Set</th>
                            <th>Reps</th>
                            <th>Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exercise.sets.map((set, setIndex) => (
                            <tr key={setIndex}>
                                <td>Set {setIndex + 1}</td>
                                <td>{set.reps}</td>
                                <td>{set.weight} kg</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
