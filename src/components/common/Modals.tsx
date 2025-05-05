import { useState, useEffect } from "react";
import { Button } from "./Buttons";

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

export function AlertModal({ text, buttonText = "Close", isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>{text}</p>
                <Button variant="blue" onClick={onClose}>
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}

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
            <div className="modal">
                <p>{text}</p>
                <div className="flex gap-4">
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
            <div className="modal">
                <p>{text}</p>
                <input
                    type="text"
                    className="w-full border border-white/10 rounded-xl p-2 bg-black/20"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="flex gap-4">
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
            <div className="modal">
                <p>Log</p>
                <textarea
                    className="w-full border border-white/10 rounded-xl p-2 bg-black/20 my-4"
                    rows={8}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                ></textarea>
                <div className="flex gap-4">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            onSubmit(textareaValue);
                            onClose();
                        }}
                        variant="blue"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
