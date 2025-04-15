import TrashIcon from "../../../assets/icons/TrashIcon";
import { ConfirmModal } from "../../common/Modals";
import { useState } from "react";

interface Exercise {
    name: string;
    sets: { reps: number; weight: number }[];
}

interface ExerciseCardProps {
    exercise: Exercise;
    index: number;
    removeExercise: (index: number) => void;
}

export default function ExerciseCard({ exercise, index, removeExercise }: ExerciseCardProps) {
    // Manage modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("");
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [removeIndex, setRemoveIndex] = useState(0);

    return (
        <>
            <ConfirmModal
                text={modalText}
                isOpen={isModalOpen}
                onClose={closeModal}
                action={() => removeExercise(removeIndex)}
            />

            <div className="p-4 bg-neutral-900 border border-white/5 rounded-xl shadow-xl">
                <h2 className="text-xl font-semibold mb-4 truncate">
                    <span className="mr-2 text-neutral-500">#{index + 1}</span>
                    {exercise.name}
                </h2>

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

                <button
                    className="cursor-pointer py-2"
                    onClick={() => {
                        setModalText("Are you sure you want to remove exercise?");
                        setRemoveIndex(index);
                        openModal();
                    }}
                >
                    <TrashIcon />
                </button>
            </div>
        </>
    );
}
