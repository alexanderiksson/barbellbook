/**
 * This component will show a temporary notice message,
 * The notice disappears after 2 seconds.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {(trigger: () => void) => void} props.registerTrigger - A function to register the `showNotice` trigger, allowing external components to control when the notice is displayed.
 * @param {string} props.msg - The message to display in the notice.
 *
 * @returns {JSX.Element} The rendered notice component.
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
                notice ? "top-1" : "-top-full"
            } content text-center p-2 bg-emerald-700/50 border border-white/10 rounded-lg absolute w-full z-20 backdrop-blur-3xl transition-all duration-300`}
        >
            {msg}
        </div>
    );
}
