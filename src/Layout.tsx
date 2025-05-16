import { Outlet } from "react-router-dom";
import Navigation from "./components/layout/Navigation";

export default function Layout() {
    return (
        <>
            <div className="h-40 w-screen bg-zinc-900/50 backdrop-blur-xl fixed -top-full z-30"></div>
            <main role="main" className="flex-1 flex flex-col justify-start pt-8 pb-20">
                <Outlet />
            </main>
            <Navigation />
        </>
    );
}
