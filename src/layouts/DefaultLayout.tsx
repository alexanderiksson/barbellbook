import { Outlet } from "react-router-dom";
import Navigation from "../components/layout/Navigation";
import SafeArea from "../components/layout/SafeArea";

export default function DefaultLayout() {
    return (
        <>
            <SafeArea />
            <main
                role="main"
                className="flex-1 flex flex-col justify-start lg:ml-52 xl:ml-60"
                style={{
                    paddingTop: "calc(1rem + var(--safe-top))",
                    paddingBottom: "calc(5rem + var(--safe-bottom))",
                }}
            >
                <Outlet />
            </main>
            <Navigation />
        </>
    );
}
