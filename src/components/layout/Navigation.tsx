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
                `flex flex-col items-center justify-center text-[10px] ${
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
            id="mobile-nav"
            className="content bg-zinc-800/70 backdrop-blur-xl border border-white/5 fixed bottom-2 py-2 z-20 rounded-full left-1/2 transform -translate-x-1/2 shadow-2xl"
        >
            <ul className="flex justify-around items-center px-4">
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
