import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function BackButton({
    to,
    label,
    noMargin,
}: {
    to: string;
    label: string;
    noMargin?: boolean;
}) {
    return (
        <Link
            className={`${
                noMargin ? "" : "mb-4 py-2"
            } inline-flex items-center text-[var(--primary-bright)] max-w-full -translate-x-2`}
            to={to}
            aria-label="Go back"
            title="Go back"
        >
            <span>
                <IoIosArrowBack
                    color={getComputedStyle(document.documentElement).getPropertyValue(
                        "--color-primary-bright"
                    )}
                    size={24}
                />
            </span>
            <span className="truncate">{label}</span>
        </Link>
    );
}
