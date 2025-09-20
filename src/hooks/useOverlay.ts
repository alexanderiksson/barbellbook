import { useState, useCallback } from "react";

export default function useOverlay(initial: boolean = false) {
    const [isOpen, setIsOpen] = useState(initial);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    return { isOpen, open, close };
}
