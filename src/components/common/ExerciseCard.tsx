import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { SetType } from "../../types/workout";
import { ConfirmModal } from "./Modals";
import { MdDeleteForever } from "react-icons/md";

interface ExerciseCardProps {
    index: number;
    name: string;
    sets: SetType[];
    canDelete?: boolean;
    onDelete?: (index: number) => void;
}

export default function ExerciseCard({
    index,
    name,
    sets,
    canDelete,
    onDelete,
}: ExerciseCardProps) {
    const { weightUnit } = useSettings();

    // Manage modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <ConfirmModal
                text="Are you sure you want to delete exercise?"
                buttonText="Delete"
                buttonVariant="danger"
                isOpen={isModalOpen}
                onClose={closeModal}
                action={() => onDelete?.(index)}
            />

            <div className="p-4 lg:px-6 bg-secondary border border-border/20 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="font-medium truncate">
                        <span className="mr-2 text-text-grey">#{index + 1}</span>
                        {name}
                    </h2>
                    {canDelete && (
                        <button
                            className="cursor-pointer"
                            onClick={() => {
                                openModal();
                            }}
                        >
                            <MdDeleteForever
                                color={getComputedStyle(document.documentElement).getPropertyValue(
                                    "--color-danger"
                                )}
                                size={24}
                            />
                        </button>
                    )}
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left">
                            <th>Set</th>
                            <th>Reps</th>
                            <th>Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sets.map((set, setIndex) => (
                            <tr key={setIndex}>
                                <td>Set {setIndex + 1}</td>
                                <td>{set.reps}</td>
                                <td>
                                    {set.weight}{" "}
                                    <span className="text-text-grey">{weightUnit}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
