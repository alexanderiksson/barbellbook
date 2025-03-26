import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <main role="main">
                <Outlet />
            </main>
        </>
    );
}
