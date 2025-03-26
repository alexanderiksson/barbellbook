import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";

export default function Layout() {
    return (
        <>
            <Nav />
            <main role="main">
                <Outlet />
            </main>
        </>
    );
}
