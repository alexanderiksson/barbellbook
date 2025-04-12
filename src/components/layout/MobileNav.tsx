import { NavLink } from "react-router-dom";

import AddIcon from "../../assets/icons/AddIcon";
import HomeIcon from "../../assets/icons/HomeIcon";
import HistoryIcon from "../../assets/icons/HistoryIcon";
/* import HamburgerIcon from "../../assets/icons/HamburgerIcon";
 */
export default function MobileNav() {
    return (
        <nav
            id="mobile-nav"
            className="max-w-md bg-neutral-800/50 backdrop-blur-xl border-t border-white/5 fixed bottom-4 w-11/12 py-3 z-20 rounded-full left-1/2 transform -translate-x-1/2"
        >
            <div className="content">
                <ul className="flex justify-around items-center">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center text-[10px] ${
                                    isActive ? "text-emerald-500" : "text-neutral-500"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <HomeIcon color={isActive ? "#10b981" : "#737373"} />
                                    <span>Start</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/add-exercise"
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center text-[10px] ${
                                    isActive ? "text-emerald-500" : "text-neutral-500"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <AddIcon color={isActive ? "#10b981" : "#737373"} />
                                    <span>Add exercise</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/history"
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center text-[10px] ${
                                    isActive ? "text-emerald-500" : "text-neutral-500"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <HistoryIcon color={isActive ? "#10b981" : "#737373"} />
                                    <span>History</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center text-[10px] ${
                                    isActive ? "text-emerald-500" : "text-neutral-500"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <HamburgerIcon color={isActive ? "#10b981" : "#737373"} />
                                    <span>Menu</span>
                                </>
                            )}
                        </NavLink>
                    </li> */}
                </ul>
            </div>
        </nav>
    );
}
