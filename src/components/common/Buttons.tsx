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
    let color =
        "bg-[var(--secondary-bright)] border-[var(--secondary-bright)] hover:bg-[var(--secondary-bright)]/90 hover:border-[var(--secondary-bright)]/90";

    if (variant === "green")
        color =
            "bg-[var(--accent)] border-[var(--accent)] hover:bg-[var(--accent)]/90 hover:border-[var(--accent)]/90 text-white";
    if (variant === "blue")
        color =
            "bg-[var(--primary)] border-[var(--primary)] hover:bg-[var(--primary)]/90 hover:border-[var(--primary)]/90 text-white";
    if (variant === "outline")
        color = "bg-transparent border-[var(--primary)] hover:bg-[var(--primary)]/10";
    if (variant === "danger")
        color =
            "bg-[var(--danger)] border-[var(--danger)] hover:bg-[var(--danger)]/90 hover:border-[var(--danger)]/90 text-white";

    return color;
};

// Link button
export function LinkButton({ children, to, variant = "neutral", className = "" }: LinkButtonProps) {
    return (
        <Link to={to} className={`${handleVariant(variant)} button ${className}`} role="button">
            {children}
        </Link>
    );
}

// Regular button
export function Button({ children, variant = "neutral", className = "", onClick }: ButtonProps) {
    return (
        <button
            className={`${handleVariant(variant)} button cursor-pointer ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
