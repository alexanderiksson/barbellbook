import { ReactNode } from "react";

export default function PageHeading({ children }: { children: ReactNode }) {
    return <h1 className="text-3xl font-semibold mb-8">{children}</h1>;
}
