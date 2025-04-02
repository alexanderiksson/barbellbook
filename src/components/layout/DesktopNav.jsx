import { NavLink } from "react-router-dom";

export default function DesktopNav() {
    return (
        <nav
            id="desktop-nav"
            className="hidden sm:block fixed w-full bg-neutral-700/25 backdrop-blur-xl border-b border-white/5 py-4 shadow-xl"
        >
            <div className="content">
                <ul className="flex justify-evenly items-center">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? "text-emerald-500" : "text-white"
                            }
                        >
                            Start
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/add-exercise"
                            className={({ isActive }) =>
                                isActive ? "text-emerald-500" : "text-white"
                            }
                        >
                            Add exercise
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/history"
                            className={({ isActive }) =>
                                isActive ? "text-emerald-500" : "text-white"
                            }
                        >
                            History
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
