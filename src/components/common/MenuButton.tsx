import { HiDotsHorizontal } from "react-icons/hi";

export default function MenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            className="bg-neutral-800 w-11 h-11 rounded-xl inline-flex justify-center items-center cursor-pointer z-20"
            onClick={onClick}
        >
            <HiDotsHorizontal size={20} />
        </button>
    );
}
