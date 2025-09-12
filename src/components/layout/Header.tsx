import BackButton from "../common/BackButton";
import { IoIosMore } from "react-icons/io";

interface HeaderProps {
    title?: string;
    backLink?: string;
    menuOnClick?: () => void;
}

export default function Header({ title, backLink, menuOnClick }: HeaderProps) {
    return (
        <div
            className="fixed w-full top-0 left-0 border-b border-[var(--border)]/20 bg-[var(--background)]/50 backdrop-blur-2xl z-20 lg:pl-54 xl:pl-60 lg:bg-[var(--secondary)]"
            style={{
                paddingTop: "calc(0.5rem + var(--safe-top))",
                paddingBottom: "1rem",
            }}
        >
            <div className="content">
                <div className="grid grid-cols-3">
                    <div className="flex">
                        {backLink && <BackButton to={backLink} label="Back" noMargin />}
                    </div>
                    <div className="flex items-center justify-center text-center">{title}</div>
                    <div className="flex items-center justify-end">
                        {menuOnClick && (
                            <button className="cursor-pointer" onClick={menuOnClick}>
                                <IoIosMore
                                    size={24}
                                    color={getComputedStyle(
                                        document.documentElement
                                    ).getPropertyValue("--primary-bright")}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
