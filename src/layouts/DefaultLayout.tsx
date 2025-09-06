import { Outlet } from "react-router-dom";
import Navigation from "../components/layout/Navigation";

export default function DefaultLayout() {
    return (
        <>
            <div className="hidden standalone:block fixed w-full top-0 h-12 border-b border-border/20 bg-secondary-bright/50 backdrop-blur-xl z-30"></div>
            <main
                role="main"
                className="flex-1 flex flex-col justify-start pt-8 pb-20 lg:pb-8 lg:ml-52 xl:ml-60 standalone:pt-20 standalone:pb-26"
            >
                <Outlet />
            </main>
            <Navigation />
        </>
    );
}
