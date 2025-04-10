import { Outlet } from "react-router-dom";
import MobileNav from "./components/layout/MobileNav";

export default function Layout() {
    return (
        <>
            <MobileNav />
            <main role="main" className="flex-1 flex flex-col justify-start mt-10 mb-28">
                <Outlet />
            </main>
        </>
    );
}
