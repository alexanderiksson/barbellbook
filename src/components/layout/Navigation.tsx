import { NavLink } from "react-router-dom";
import { IoIosAddCircle, IoIosTime, IoIosHome, IoIosStats, IoIosSettings } from "react-icons/io";

interface TabProps {
    to: string;
    label: string;
    Icon: React.ElementType;
}

const Tab = ({ to, label, Icon }: TabProps) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col lg:flex-row lg:gap-2 items-center justify-center text-[10px] lg:text-base ${
                    isActive ? "text-[var(--accent-bright)]" : "text-[var(--nav-text)]"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon color={isActive ? "var(--accent-bright)" : "var(--nav-text)"} size={24} />
                    <span>{label}</span>
                </>
            )}
        </NavLink>
    );
};

export default function Navigation() {
    return (
        <nav
            className={`bg-[var(--secondary-bright)]/50 backdrop-blur-xl border-t border-[var(--border)]/20 fixed z-20 w-full bottom-0 left-0 py-2
            lg:top-0 lg:left-0 lg:bottom-0 lg:w-52 xl:w-60 lg:h-full lg:py-12 lg:flex lg:flex-col lg:px-6 xl:px-8 lg:border-r`}
            role="navigation"
            style={{
                paddingBottom: "calc(0.5rem + var(--safe-bottom))",
            }}
        >
            <ul
                className="flex justify-around items-center px-4 lg:p-0 flex-row h-full
            lg:flex-col lg:justify-start lg:items-start lg:space-y-16 lg:space-x-0 lg:h-auto"
            >
                <li>
                    <Tab to="/" label="Start" Icon={IoIosHome} />
                </li>
                <li>
                    <Tab to="/log-exercise" label="Log exercise" Icon={IoIosAddCircle} />
                </li>
                <li>
                    <Tab to="/history" label="History" Icon={IoIosTime} />
                </li>
                <li>
                    <Tab to="/stats" label="Stats" Icon={IoIosStats} />
                </li>
                <li>
                    <Tab to="/settings" label="Settings" Icon={IoIosSettings} />
                </li>
            </ul>
        </nav>
    );
}
