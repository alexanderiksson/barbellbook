import { NavLink } from "react-router-dom";
import { IoIosAddCircle, IoIosTime, IoIosHome } from "react-icons/io";

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
                    isActive ? "text-emerald-500" : "text-neutral-400"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon color={isActive ? "#10b981" : "#a3a3a3"} size={28} />
                    <span>{label}</span>
                </>
            )}
        </NavLink>
    );
};

export default function Navigation() {
    return (
        <nav
            className="bg-zinc-800/70 backdrop-blur-xl border-t border-white/5 fixed z-20 shadow-2xl w-full bottom-0 left-0 py-2 h-16
            lg:top-0 lg:left-0 lg:bottom-0 lg:w-52 lg:h-full lg:py-12 lg:flex lg:flex-col lg:px-2 lg:border-r"
        >
            <ul
                className="flex justify-around items-center px-4 flex-row h-full
            lg:flex-col lg:justify-start lg:items-start lg:space-y-20 lg:space-x-0 lg:h-auto"
            >
                <li>
                    <Tab to="/" label="Start" Icon={IoIosHome} />
                </li>
                <li>
                    <Tab to="/add-exercise" label="Add exercise" Icon={IoIosAddCircle} />
                </li>
                <li>
                    <Tab to="/history" label="History" Icon={IoIosTime} />
                </li>
            </ul>
        </nav>
    );
}
