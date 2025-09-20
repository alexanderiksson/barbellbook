import { ReactNode } from "react";

export default function PageHeading({ children }: { children: ReactNode }) {
    return (
        <h1 className="text-xl lg:text-2xl font-semibold mb-6 lg:mb-8 truncate flex flex-col gap-2 items-start">
            {children}
        </h1>
    );
}
