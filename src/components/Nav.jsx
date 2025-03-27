import React from "react";
import { NavLink } from "react-router-dom";
import AddIcon from "../assets/icons/AddIcon";
import HomeIcon from "../assets/icons/HomeIcon";
import HistoryIcon from "../assets/icons/HistoryIcon";

export default function Nav() {
    return (
        <nav className="bg-neutral-900 border-t border-white/5 fixed bottom-0 w-full">
            <div className="content">
                <ul className="flex justify-evenly">
                    <li>
                        <NavLink
                            to="/"
                            className="flex flex-col items-center justify-center text-xs gap-1 py-3 px-5"
                        >
                            <HomeIcon />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/add-exercise"
                            className="flex flex-col items-center justify-center text-xs gap-1 py-3 px-5"
                        >
                            <AddIcon />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/history"
                            className="flex flex-col items-center justify-center text-xs gap-1 py-3 px-5"
                        >
                            <HistoryIcon />
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
