import { Outlet } from "react-router-dom";
import MobileNav from "./components/MobileNav";
import DesktopNav from "./components/DesktopNav";

export default function Layout() {
    return (
        <>
            <DesktopNav />
            <MobileNav />
            <main
                role="main"
                className="flex-1 flex flex-col justify-start sm:mt-28 mt-10 mb-20 sm:mb-8"
            >
                <Outlet />
            </main>
        </>
    );
}
