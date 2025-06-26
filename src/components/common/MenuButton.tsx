import { HiDotsVertical } from "react-icons/hi";

export default function MenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            className="bg-secondary w-10 h-10 rounded-xl inline-flex justify-center items-center cursor-pointer z-20"
            onClick={onClick}
            aria-label="Open menu"
            title="Open menu"
        >
            <HiDotsVertical size={20} />
        </button>
    );
}
