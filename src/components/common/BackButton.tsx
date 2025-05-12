/**
 * A reusable back button component that navigates to a specified route.
 *
 * @param to - The target route to navigate to when the button is clicked.
 * @param label - The text label displayed next to the arrow icon.
 *
 * @example
 * ```tsx
 * <BackButton to="/home" label="Go Back" />
 * ```
 */

import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function BackButton({ to, label }: { to: string; label: string }) {
    return (
        <Link
            className="mb-4 inline-flex items-center py-2 text-sky-500 max-w-full -translate-x-2"
            to={to}
        >
            <span>
                <IoIosArrowBack color="#0ea5e9" size={28} />
            </span>
            <span className="truncate">{label}</span>
        </Link>
    );
}
