import { Outlet } from "react-router-dom";
import Navigation from "./components/layout/Navigation";

export default function Layout() {
    return (
        <>
            {/* <div className="h-16 w-screen bg-zinc-900/50 backdrop-blur-xl fixed top-0 z-30 border-b border-white/5"></div> */}
            <main role="main" className="flex-1 flex flex-col justify-start pt-8 pb-20">
                <Outlet />
            </main>
            <Navigation />
        </>
    );
}
