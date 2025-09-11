import { IoIosMore } from "react-icons/io";

export default function MenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            className="bg-[var(--secondary)] w-10 h-10 rounded-xl inline-flex justify-center items-center cursor-pointer z-10"
            onClick={onClick}
            aria-label="Open menu"
            title="Open menu"
        >
            <IoIosMore size={20} />
        </button>
    );
}
