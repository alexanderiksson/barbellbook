import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { WorkoutProvider } from "./context/WorkoutContext";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import ScrollToTop from "./components/common/ScrollToTop";

import DefaultLayout from "./layouts/DefaultLayout";
import Home from "./pages/Home";
import LogExericse from "./pages/LogExercise";
import History from "./pages/History";
import Workout from "./pages/Workout";
import Stats from "./pages/Stats";
import ExerciseStats from "./pages/ExerciseStats";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function ThemedApp() {
    const { actualTheme } = useSettings();

    useEffect(() => {
        if (actualTheme === "light") {
            document.body.classList.add("light");
        } else {
            document.body.classList.remove("light");
        }
    }, [actualTheme]);

    return (
        <WorkoutProvider>
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/log-exercise" element={<LogExericse />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/history/:id" element={<Workout />} />
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/stats/exercises/:id" element={<ExerciseStats />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </WorkoutProvider>
    );
}

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <SettingsProvider>
                <ThemedApp />
            </SettingsProvider>
        </Router>
    );
}
