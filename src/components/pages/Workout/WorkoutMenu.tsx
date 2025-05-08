/* THIS COMPONENT IS UNUSED */

import { Link } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { IoIosStats } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { IoIosList } from "react-icons/io";

interface WorkoutMenuProps {
    id: string | undefined;
    isOpen: boolean;
    closeMenu: () => void;
    openPromptModal: () => void;
    openConfirmModal: () => void;
    openLogModal: () => void;
}

export default function WorkoutMenu({
    id,
    isOpen,
    closeMenu,
    openPromptModal,
    openConfirmModal,
    openLogModal,
}: WorkoutMenuProps) {
    return (
        <div
            className={`${
                isOpen ? "block" : "hidden"
            } absolute bg-neutral-800/75 backdrop-blur-lg rounded-xl w-52 right-0 top-12 shadow-xl overflow-hidden z-20`}
        >
            <ul className="divide-y divide-neutral-700">
                <li
                    className="flex justify-between items-center gap-1.5 p-4 cursor-pointer"
                    onClick={() => {
                        openLogModal();
                        closeMenu();
                    }}
                >
                    Log <IoIosList size={24} />
                </li>

                <li className="text-center">
                    <Link
                        to={`/history/${id}/stats`}
                        className="flex justify-between items-center gap-1.5 p-4"
                    >
                        Stats <IoIosStats size={24} />
                    </Link>
                </li>

                <li
                    className="flex justify-between items-center gap-1.5 p-4 cursor-pointer"
                    onClick={() => {
                        openPromptModal();
                        closeMenu();
                    }}
                >
                    Edit name <BiSolidEditAlt size={24} />
                </li>

                <li
                    className="flex justify-between items-center gap-1.5 p-4 cursor-pointer text-red-500"
                    onClick={() => {
                        openConfirmModal();
                        closeMenu();
                    }}
                >
                    Delete <MdDeleteForever color="dc2626" size={24} />
                </li>
            </ul>
        </div>
    );
}
