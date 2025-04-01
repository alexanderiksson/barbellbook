import { Link } from "react-router-dom";

export function LinkButton({ children, to, variant, className }) {
    if (variant == "green") {
        variant = "bg-emerald-700";
    } else if (variant == "blue") {
        variant = "bg-sky-700";
    } else {
        variant = "bg-neutral-700";
    }

    return (
        <Link
            to={to}
            className={`${variant} px-4 py-2 rounded-lg inline-flex justify-center items-center gap-2 ${className}`}
        >
            {children}
        </Link>
    );
}

export function Button({ children, variant, className, onClick }) {
    if (variant == "green") {
        variant = "bg-emerald-700";
    } else if (variant == "blue") {
        variant = "bg-sky-700";
    } else {
        variant = "bg-neutral-700";
    }

    return (
        <button
            className={`${variant} px-4 py-2 rounded-lg inline-flex justify-center items-center cursor-pointer gap-2 ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
