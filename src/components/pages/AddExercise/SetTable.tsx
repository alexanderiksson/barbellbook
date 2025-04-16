import TrashIcon from "../../../assets/icons/TrashIcon";
import { ConfirmModal } from "../../common/Modals";
import { useState } from "react";

interface Set {
    reps: number;
    weight: number;
}

interface SetTableProps {
    currentSets: Set[];
    removeCurrentSets: (index: number) => void;
}

export default function SetTable({ currentSets, removeCurrentSets }: SetTableProps) {
    // Manage modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [removeIndex, setRemoveIndex] = useState(0);

    return (
        <>
            <ConfirmModal
                text="Are you sure you want to delete set?"
                buttonText="Delete"
                buttonVariant="danger"
                isOpen={isModalOpen}
                onClose={closeModal}
                action={() => removeCurrentSets(removeIndex)}
            />

            <table className="w-full">
                <thead className="border-b border-white/15">
                    <tr>
                        <th className="py-2">Set</th>
                        <th className="py-2">Weight</th>
                        <th className="py-2">Reps</th>
                    </tr>
                </thead>
                <tbody>
                    {currentSets.map((set, index) => (
                        <tr key={index} className="text-center">
                            <td>Set {index + 1}</td>
                            <td>{set.weight} kg</td>
                            <td>{set.reps}</td>
                            <td className="flex justify-center">
                                <button
                                    className="cursor-pointer p-2"
                                    onClick={() => {
                                        setRemoveIndex(index);
                                        openModal();
                                    }}
                                >
                                    <TrashIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
