/**
 * This component will show a temporary notice message,
 * The notice disappears after 2 seconds.
 *
 * @example
 * ```tsx
 * const triggerRef = useRef<() => void>();
 *
 * <Notice
 *   registerTrigger={(trigger) => (triggerRef.current = trigger)}
 *   msg="This is a notice message!"
 * />
 *
 * // To show the notice:
 * triggerRef.current?.();
 * ```
 */

import { useState } from "react";

interface NoticeProps {
    registerTrigger: (trigger: () => void) => void;
    msg: string;
}

export default function Notice({ registerTrigger, msg }: NoticeProps) {
    const [notice, setNotice] = useState<boolean>(false);

    const showNotice = () => {
        setNotice(true);
        setTimeout(() => {
            setNotice(false);
        }, 2000);
    };

    registerTrigger(showNotice);

    return (
        <div
            className={`${
                notice ? "top-2 standalone:top-20" : "-top-full"
            } content text-center p-3 bg-accent/70 border border-border/50 rounded-lg fixed w-full z-20 backdrop-blur-3xl transition-all duration-300`}
            role="alert"
        >
            {msg}
        </div>
    );
}
