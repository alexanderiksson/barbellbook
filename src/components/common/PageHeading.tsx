/**
 * A functional component that renders a page heading.
 *
 * @param children - The content to be displayed inside the heading.
 *                   It accepts any valid ReactNode.
 * @returns A styled `<h1>` element with the provided children.
 */

import { ReactNode } from "react";

export default function PageHeading({ children }: { children: ReactNode }) {
    return <h1 className="text-xl lg:text-2xl  font-semibold mb-4 lg:mb-8 truncate">{children}</h1>;
}
