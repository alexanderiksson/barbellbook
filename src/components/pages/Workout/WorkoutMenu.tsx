import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { IoList } from "react-icons/io5";

interface WorkoutMenuProps {
    id: string | undefined;
    isOpen: boolean;
    openPromptModal: () => void;
    openConfirmModal: () => void;
}

export default function WorkoutMenu({
    id,
    isOpen,
    openPromptModal,
    openConfirmModal,
}: WorkoutMenuProps) {
    return (
        <div
            className={`${
                isOpen ? "block" : "hidden"
            } absolute bg-neutral-800 rounded-xl w-52 right-0 top-12 shadow-xl overflow-hidden z-20`}
        >
            <ul className="divide-y divide-neutral-700">
                <li className="flex justify-center items-center gap-1.5 text-center py-3 cursor-not-allowed">
                    <IoList size={22} /> Log
                </li>

                <li className="text-center">
                    <Link
                        to={`/history/${id}/stats`}
                        className="flex justify-center items-center gap-1.5 py-3"
                    >
                        <FaChartSimple size={18} /> Stats
                    </Link>
                </li>

                <li
                    className="flex justify-center items-center gap-1.5 text-center py-3 cursor-pointer"
                    onClick={() => {
                        openPromptModal();
                    }}
                >
                    <FaPen size={16} /> Edit name
                </li>

                <li
                    className="flex justify-center items-center gap-1.5 text-center py-3 cursor-pointer text-red-500"
                    onClick={() => {
                        openConfirmModal();
                    }}
                >
                    <MdDeleteForever color="dc2626" size={22} /> Delete
                </li>
            </ul>
        </div>
    );
}
