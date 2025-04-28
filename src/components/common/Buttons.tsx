/**
 * This is a reusable button component with customizable styles and diffrent variants.
 */

import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LinkButtonProps {
    children: ReactNode;
    to: string;
    variant?: string;
    className?: string;
}

interface ButtonProps {
    children: ReactNode;
    variant?: string;
    className?: string;
    onClick?: () => void;
}

const handleVariant = (variant: string) => {
    let TWClass = "bg-neutral-700 border-neutral-700";

    if (variant === "green") TWClass = "bg-emerald-700 border-emerald-700";
    if (variant === "blue") TWClass = "bg-sky-700 border-sky-700";
    if (variant === "outline") TWClass = "bg-transparent border-sky-700";
    if (variant === "danger") TWClass = "bg-red-700 border-red-700";

    return TWClass;
};

export function LinkButton({ children, to, variant = "neutral", className = "" }: LinkButtonProps) {
    return (
        <Link
            to={to}
            className={`${handleVariant(
                variant
            )} px-4 py-2.5 rounded-full inline-flex justify-center items-center gap-2 border-2 ${className}`}
        >
            {children}
        </Link>
    );
}

export function Button({ children, variant = "neutral", className = "", onClick }: ButtonProps) {
    return (
        <button
            className={`${handleVariant(
                variant
            )} px-4 py-2.5 rounded-full inline-flex justify-center items-center cursor-pointer gap-2 border-2 ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
