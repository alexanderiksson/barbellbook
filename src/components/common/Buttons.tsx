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
    let color = "bg-neutral-700 border-neutral-700";

    if (variant === "green") color = "bg-accent border-accent";
    if (variant === "blue") color = "bg-primary border-primary";
    if (variant === "outline") color = "bg-transparent border-primary";
    if (variant === "danger") color = "bg-danger border-danger";

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
