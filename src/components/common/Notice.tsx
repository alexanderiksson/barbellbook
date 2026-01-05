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
        }, 1500);
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
