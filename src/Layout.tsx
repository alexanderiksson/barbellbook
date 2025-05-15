import { Outlet } from "react-router-dom";
import Navigation from "./components/layout/Navigation";

export default function Layout() {
    return (
        <>
            <main role="main" className="flex-1 flex flex-col justify-start mt-8 mb-20">
                <Outlet />
            </main>
            <Navigation />
        </>
    );
}
