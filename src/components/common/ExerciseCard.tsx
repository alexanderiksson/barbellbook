import { useSettings } from "../../context/SettingsContext";
import useModal from "../../hooks/useModal";
import { SetType } from "../../types/workout";
import { ConfirmModal } from "./Modals";
import { MdDeleteForever } from "react-icons/md";
import Menu from "./Menu";
import useMenu from "../../hooks/useMenu";
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
    const confirmModal = useModal();

    // Manage menu state
    const menu = useMenu();

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

            <div className="p-4 lg:px-6 bg-[var(--secondary)] border border-[var(--border)]/20 rounded-2xl">
                <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="font-medium truncate">
                        <span className="mr-2 text-[var(--text-grey)]">#{index + 1}</span>
                        {name}
                    </h2>

                    {showMenu && (
                        <div className="flex relative">
                            <button
                                className="inline-flex justify-center items-center cursor-pointer"
                                onClick={() => (menu.isOpen ? menu.close() : menu.open())}
                            >
                                <IoIosMore size={20} />
                            </button>

                            <Menu
                                isOpen={menu.isOpen}
                                closeMenu={menu.close}
                                menuItems={[
                                    /* {
                                        type: "function" as const,
                                        label: "Edit",
                                        icon: BiSolidEditAlt,
                                    } */
                                    ...(canDelete
                                        ? [
                                              {
                                                  type: "function" as const,
                                                  label: "Delete",
                                                  icon: MdDeleteForever,
                                                  danger: true,
                                                  onClick: () => confirmModal.open(),
                                              },
                                          ]
                                        : []),
                                ]}
                            />
                        </div>
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
