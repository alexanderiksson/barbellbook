import { ChangeEvent, ReactNode } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface SelectProps {
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    value: any;
    children: ReactNode;
}

interface TextInputProps {
    placeholder?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: any;
    className?: string;
}

// Select input
export function Select({ onChange, value, children }: SelectProps) {
    return (
        <div className="relative mb-4 w-full lg:w-sm">
            <select
                className="appearance-none py-2 px-4 w-full border border-[var(--border)]/40 rounded-full bg-[var(--input)]/50 text-sm text-center last"
                onChange={onChange}
                value={value}
                style={{
                    textAlignLast: "center",
                }}
            >
                {children}
            </select>

            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-grey)]">
                <IoIosArrowDown size={16} />
            </div>
        </div>
    );
}

// Text input
export function TextInput({ placeholder, value, onChange, className }: TextInputProps) {
    return (
        <input
            className={`bg-[var(--input)]/50 py-2 px-4 rounded-full w-full border border-[var(--border)]/40 placeholder:text-[var(--text-grey)]/50 ${className}`}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}
