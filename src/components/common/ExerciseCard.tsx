import { useSettings } from "../../context/SettingsContext";
import useOverlay from "../../hooks/useOverlay";
import { SetType } from "../../types/workout";
import { ConfirmModal } from "./Modals";
import { MdDeleteForever } from "react-icons/md";
import Menu from "./Menu";
import { IoIosMore } from "react-icons/io";

interface ExerciseCardProps {
    index: number;
    name: string;
    sets: SetType[];
    showMenu?: boolean;
    canDelete?: boolean;
    onDelete?: (index: number) => void;
}

export default function ExerciseCard({
    index,
    name,
    sets,
    showMenu,
    canDelete,
    onDelete,
}: ExerciseCardProps) {
    const { weightUnit } = useSettings();

    // Manage modal state
    const confirmModal = useOverlay();

    // Manage menu state
    const menu = useOverlay();

    return (
        <>
            <ConfirmModal
                text="Are you sure you want to delete exercise?"
                buttonText="Delete"
                buttonVariant="danger"
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.close}
                action={() => onDelete?.(index)}
            />

            <Menu
                isOpen={menu.isOpen}
                closeMenu={menu.close}
                menuItems={[
                    ...(canDelete
                        ? [
                              {
                                  type: "function" as const,
                                  label: "Delete exercise",
                                  icon: MdDeleteForever,
                                  danger: true,
                                  onClick: () => confirmModal.open(),
                              },
                          ]
                        : []),
                ]}
            />

            <div className="p-4 lg:px-6 bg-[var(--secondary)] border border-[var(--border)]/20 rounded-[var(--radius)]">
                <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="font-medium truncate">
                        <span className="mr-2 text-[var(--text-grey)]">#{index + 1}</span>
                        {name}
                    </h2>

                    {showMenu && (
                        <button
                            className="inline-flex justify-center items-center cursor-pointer"
                            onClick={() => (menu.isOpen ? menu.close() : menu.open())}
                        >
                            <IoIosMore size={20} />
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
                                    <span className="text-[var(--text-grey)]">{weightUnit}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
