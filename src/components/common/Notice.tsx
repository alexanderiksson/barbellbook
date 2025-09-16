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
                notice ? "top-[calc(4rem+var(--safe-top))]" : "-top-full"
            } content text-center p-3 bg-[var(--accent)]/50 border border-[var(--accent)]/50 rounded-[var(--radius)] fixed w-full z-10 backdrop-blur-lg transition-all duration-400 ease-in-out`}
            role="alert"
        >
            {msg}
        </div>
    );
}
