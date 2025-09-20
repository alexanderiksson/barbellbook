import { useState } from "react";
import { useSettings } from "../../../context/SettingsContext";
import { SetType } from "../../../types/workout";
import useOverlay from "../../../hooks/useOverlay";

import { ConfirmModal } from "../../common/Modals";
import { MdDeleteForever } from "react-icons/md";

interface SetTableProps {
    currentSets: SetType[];
    removeCurrentSets: (index: number) => void;
}

export default function SetTable({ currentSets, removeCurrentSets }: SetTableProps) {
    const { weightUnit } = useSettings();

    // Manage modal state
    const confirmModal = useOverlay();

    const [removeIndex, setRemoveIndex] = useState(0);

    return (
        <>
            <ConfirmModal
                text="Are you sure you want to delete set?"
                buttonText="Delete"
                buttonVariant="danger"
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.close}
                action={() => removeCurrentSets(removeIndex)}
            />

            <table className="w-full">
                <thead className="border-b border-[var(--border)]">
                    <tr>
                        <th className="py-2 font-normal">Set</th>

                        <th className="py-2 font-normal">Reps</th>
                        <th className="py-2 font-normal">Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {currentSets.map((set, index) => (
                        <tr key={index} className="text-center">
                            <td>Set {index + 1}</td>
                            <td>{set.reps}</td>
                            <td>
                                {set.weight}{" "}
                                <span className="text-[var(--text-grey)]">{weightUnit}</span>
                            </td>
                            <td className="flex justify-center">
                                <button
                                    className="cursor-pointer p-2"
                                    onClick={() => {
                                        setRemoveIndex(index);
                                        confirmModal.open();
                                    }}
                                >
                                    <MdDeleteForever
                                        color={getComputedStyle(
                                            document.documentElement
                                        ).getPropertyValue("--danger")}
                                        size={24}
                                    />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
