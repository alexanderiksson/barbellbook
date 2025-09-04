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
    let color =
        "bg-neutral-700 border-neutral-700 hover:bg-neutral-700/90 hover:border-neutral-700/90";

    if (variant === "green")
        color = "bg-accent border-accent hover:bg-accent/90 hover:border-accent/90";
    if (variant === "blue")
        color = "bg-primary border-primary hover:bg-primary/90 hover:border-primary/90";
    if (variant === "outline") color = "bg-transparent border-primary hover:bg-primary/10";
    if (variant === "danger")
        color = "bg-danger border-danger hover:bg-danger/90 hover:border-danger/90";

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
