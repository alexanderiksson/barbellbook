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
                    isActive ? "text-accent-bright" : "text-neutral-400"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon
                        color={
                            isActive
                                ? getComputedStyle(document.documentElement).getPropertyValue(
                                      "--color-accent-bright"
                                  )
                                : "#a3a3a3"
                        }
                        size={28}
                    />
                    <span>{label}</span>
                </>
            )}
        </NavLink>
    );
};

export default function Navigation() {
    return (
        <nav
            className="bg-secondary-bright/50 backdrop-blur-xl border-t border-border/20 fixed z-20 shadow-2xl w-full bottom-0 left-0 py-2 h-16
            lg:top-0 lg:left-0 lg:bottom-0 lg:w-52 xl:w-60 lg:h-full lg:py-12 lg:flex lg:flex-col lg:px-2 xl:px-4 lg:border-r standalone:h-22 standalone:pb-8"
            role="navigation"
        >
            <ul
                className="flex justify-around items-center px-4 flex-row h-full
            lg:flex-col lg:justify-start lg:items-start lg:space-y-16 lg:space-x-0 lg:h-auto"
            >
                <li>
                    <Tab to="/" label="Start" Icon={IoIosHome} />
                </li>
                <li>
                    <Tab to="/log-exercise" label="Log Exercise" Icon={IoIosAddCircle} />
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
