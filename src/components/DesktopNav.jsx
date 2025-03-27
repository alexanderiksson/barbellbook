import { NavLink } from "react-router-dom";
import AddIcon from "../assets/icons/AddIcon";
import HomeIcon from "../assets/icons/HomeIcon";
import HistoryIcon from "../assets/icons/HistoryIcon";

export default function DesktopNav() {
    return (
        <nav
            id="desktop-nav"
            className="hidden sm:block fixed w-full bg-neutral-900/50 backdrop-blur-2xl border-b border-white/5"
        >
            <div className="content">
                <ul className="flex justify-evenly items-center">
                    <li>
                        <NavLink to="/" className="flex items-center gap-2 p-4">
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/add-exercise"
                            className="flex items-center gap-2 p-4"
                        >
                            Add exercise
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/history"
                            className="flex items-center gap-2 p-4"
                        >
                            History
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
