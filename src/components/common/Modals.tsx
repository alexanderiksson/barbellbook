import { useState, useEffect } from "react";
import { Button } from "./Buttons";
import { IoIosClose } from "react-icons/io";
import { IoIosAlert } from "react-icons/io";

interface ModalProps {
    text?: string;
    buttonText?: string;
    isOpen: boolean;
    onClose: () => void;
}

interface ConfirmModalProps extends ModalProps {
    action: (...args: any[]) => void;
    buttonVariant?: string;
}

interface PromptModalProps extends ModalProps {
    initialValue?: string;
    onSubmit: (...args: any[]) => void;
}

interface LogModalProps extends ModalProps {
    initialValue: string | undefined;
    onSubmit: (...args: any[]) => void;
}

// Alert modal
export function AlertModal({ text, buttonText = "Close", isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal" role="dialog" aria-modal="true">
                <h2 className="text-lg font-semibold text-center">{text}</h2>
                <Button variant="blue" onClick={onClose}>
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}

// Confirm modal
export function ConfirmModal({
    text,
    buttonText = "Ok",
    isOpen,
    onClose,
    action,
    buttonVariant = "blue",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal" role="dialog" aria-modal="true">
                <div className="w-full flex justify-between items-center gap-2">
                    <h2 className="font-semibold ml-1 flex items-center gap-3">
                        <IoIosAlert size={40} className="translate-y-0.5" /> {text}
                    </h2>
                    <IoIosClose
                        size={32}
                        color="grey"
                        className="cursor-pointer flex-shrink-0"
                        onClick={() => {
                            onClose();
                        }}
                    />
                </div>
                <div className="w-full flex justify-end gap-4">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        variant={buttonVariant}
                        onClick={() => {
                            action();
                            onClose();
                        }}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Prompt modal
export function PromptModal({
    text,
    buttonText = "Ok",
    isOpen,
    onClose,
    initialValue,
    onSubmit,
}: PromptModalProps) {
    const [inputValue, setInputValue] = useState(initialValue || "");

    useEffect(() => {
        if (initialValue) {
            setInputValue(initialValue);
        }
    }, [initialValue]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal" role="dialog" aria-modal="true">
                <div className="w-full flex justify-between gap-2">
                    <h2 className="text-lg font-semibold ml-1">{text}</h2>
                    <IoIosClose
                        size={32}
                        color="grey"
                        className="cursor-pointer flex-shrink-0"
                        onClick={() => {
                            onClose();
                        }}
                    />
                </div>
                <input
                    type="text"
                    className="w-full border border-[var(--border)]/50 rounded-xl p-2 bg-black/20"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                />
                <div className="w-full flex justify-end gap-4">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        variant="blue"
                        onClick={() => {
                            onSubmit(inputValue);
                            onClose();
                        }}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Log modal
export function LogModal({ isOpen, onClose, initialValue, onSubmit }: LogModalProps) {
    const [textareaValue, setTextareaValue] = useState("");

    useEffect(() => {
        if (initialValue) {
            setTextareaValue(initialValue);
        }
    }, [initialValue]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal" role="dialog" aria-modal="true">
                <div className="w-full flex justify-between gap-2">
                    <h2 className="text-lg font-semibold ml-1">Log</h2>
                    <IoIosClose
                        size={32}
                        color="grey"
                        className="cursor-pointer flex-shrink-0"
                        onClick={() => {
                            onSubmit(textareaValue);
                            onClose();
                        }}
                    />
                </div>

                <textarea
                    className="w-full rounded-xl p-4 bg-black/50 mb-2"
                    rows={15}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                ></textarea>
            </div>
        </div>
    );
}
