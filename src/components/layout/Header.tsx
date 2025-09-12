import BackButton from "../common/BackButton";

interface HeaderProps {
    title?: string;
    backLink?: string;
}

export default function Header({ title, backLink }: HeaderProps) {
    return (
        <div
            className="fixed w-full top-0 left-0 border-b border-[var(--border)]/20 bg-[var(--background)]/70 backdrop-blur-xl z-30 flex justify-center items-center text-center text-sm"
            style={{
                paddingTop: "calc(1rem + var(--safe-top))",
                paddingBottom: "1rem",
            }}
        >
            <div className="content">
                <div className="grid grid-cols-3">
                    <div className="flex">
                        {backLink && <BackButton to={backLink} label="Back" noMargin />}
                    </div>
                    <div className="flex items-center justify-center text-center">{title}</div>
                </div>
            </div>
        </div>
    );
}
