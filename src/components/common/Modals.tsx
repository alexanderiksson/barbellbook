import { useState, useEffect } from "react";
import { Button } from "./Buttons";

interface ModalProps {
    text: string;
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

export function AlertModal({ text, buttonText = "Close", isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="w-screen h-screen fixed flex justify-center items-center top-0 left-0 bg-black/70 z-30">
            <div className="max-w-[90%] w-80 h-40 bg-neutral-700/30 backdrop-blur-lg rounded-xl border border-white/5 p-4 flex flex-col items-center justify-around text-center">
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
        <div className="w-screen h-screen fixed flex justify-center items-center top-0 left-0 bg-black/70 z-30">
            <div className="max-w-[90%] w-80 h-40 bg-neutral-700/30 backdrop-blur-lg rounded-xl border border-white/5 p-4 flex flex-col items-center justify-around text-center">
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
        <div className="w-screen h-screen fixed flex justify-center items-center top-0 left-0 bg-black/70 z-30">
            <div className="max-w-[90%] w-80 h-56 bg-neutral-700/30 backdrop-blur-lg rounded-xl border border-white/5 p-4 flex flex-col items-center justify-around text-center">
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
