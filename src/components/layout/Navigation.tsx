import { NavLink } from "react-router-dom";

import AddIcon from "../../assets/icons/AddIcon";
import HomeIcon from "../../assets/icons/HomeIcon";
import HistoryIcon from "../../assets/icons/HistoryIcon";

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
                    isActive ? "text-emerald-500" : "text-neutral-500"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon color={isActive ? "#10b981" : "#737373"} />
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
            className="max-w-md bg-neutral-800/50 backdrop-blur-xl border-t border-white/5 fixed bottom-4 w-11/12 py-2 z-20 rounded-full left-1/2 transform -translate-x-1/2"
        >
            <div className="content">
                <ul className="flex justify-around items-center">
                    <li>
                        <Tab to="/" label="Start" Icon={HomeIcon} />
                    </li>
                    <li>
                        <Tab to="/add-exercise" label="Add exercise" Icon={AddIcon} />
                    </li>
                    <li>
                        <Tab to="/history" label="History" Icon={HistoryIcon} />
                    </li>
                </ul>
            </div>
        </nav>
    );
}
