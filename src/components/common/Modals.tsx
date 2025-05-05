import { useState, useEffect } from "react";
import { Button } from "./Buttons";
import { IoCloseOutline } from "react-icons/io5";

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
                <h2 className="text-xl font-semibold">{text}</h2>
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
                <div className="w-full flex justify-between gap-2">
                    <h2 className="text-xl font-semibold ml-1">{text}</h2>
                    <IoCloseOutline
                        size={28}
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
                <div className="w-full flex justify-between gap-2">
                    <h2 className="text-xl font-semibold ml-1">{text}</h2>
                    <IoCloseOutline
                        size={28}
                        color="grey"
                        className="cursor-pointer flex-shrink-0"
                        onClick={() => {
                            onClose();
                        }}
                    />
                </div>
                <input
                    type="text"
                    className="w-full border border-white/10 rounded-xl p-2 bg-black/20"
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
                <div className="w-full flex justify-between gap-2">
                    <h2 className="text-xl font-semibold ml-1">Log</h2>
                    <IoCloseOutline
                        size={28}
                        color="grey"
                        className="cursor-pointer flex-shrink-0"
                        onClick={() => {
                            onSubmit(textareaValue);
                            onClose();
                        }}
                    />
                </div>

                <textarea
                    className="w-full border border-white/10 rounded-xl p-2 bg-black/20 mb-2"
                    rows={10}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                ></textarea>
            </div>
        </div>
    );
}
