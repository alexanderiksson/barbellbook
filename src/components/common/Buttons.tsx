import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LinkButtonProps {
    children: ReactNode;
    to: string;
    variant?: "green" | "blue" | "neutral";
    className?: string;
}

interface ButtonProps {
    children: ReactNode;
    variant?: "green" | "blue" | "neutral";
    className?: string;
    onClick?: () => void;
}

export function LinkButton({ children, to, variant = "neutral", className = "" }: LinkButtonProps) {
    let variantClass = "bg-neutral-700";
    if (variant === "green") {
        variantClass = "bg-emerald-700";
    } else if (variant === "blue") {
        variantClass = "bg-sky-700";
    }

    return (
        <Link
            to={to}
            className={`${variantClass} px-4 py-2 rounded-lg inline-flex justify-center items-center gap-2 ${className}`}
        >
            {children}
        </Link>
    );
}

export function Button({ children, variant = "neutral", className = "", onClick }: ButtonProps) {
    let variantClass = "bg-neutral-700";
    if (variant === "green") {
        variantClass = "bg-emerald-700";
    } else if (variant === "blue") {
        variantClass = "bg-sky-700";
    }

    return (
        <button
            className={`${variantClass} px-4 py-2 rounded-lg inline-flex justify-center items-center cursor-pointer gap-2 ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
