import { ChangeEvent, ReactNode } from "react";
import { IoIosArrowDown, IoIosSearch, IoIosCloseCircle } from "react-icons/io";

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

interface SearchFieldProps extends TextInputProps {
    onClear: () => void;
}

// Select input
export function Select({ onChange, value, children }: SelectProps) {
    return (
        <div className="relative mb-6 max-w-sm">
            <select
                className="appearance-none py-2 px-4 w-full border border-[var(--border)]/20 rounded-full bg-[var(--input)]/50 text-sm"
                onChange={onChange}
                value={value}
                style={{
                    textAlignLast: "left",
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
            className={`bg-[var(--input)]/50 py-2 px-4 rounded-full w-full border border-[var(--border)]/20 placeholder:text-[var(--text-grey)]/80 ${className}`}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}

// Search field
export function SearchField({
    placeholder,
    value,
    onClear,
    onChange,
    className,
}: SearchFieldProps) {
    return (
        <div className="relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-[var(--text-grey)]">
                <IoIosSearch />
            </div>
            <TextInput
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`px-10 ${className}`}
            />
            {value && (
                <div
                    className="absolute top-1/2 -translate-y-1/2 right-4 text-[var(--text-grey)] cursor-pointer"
                    onClick={onClear}
                >
                    <IoIosCloseCircle />
                </div>
            )}
        </div>
    );
}
