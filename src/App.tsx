import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { WorkoutProvider } from "./context/WorkoutContext";
import { SettingsProvider } from "./context/SettingsContext";

import DefaultLayout from "./layouts/DefaultLayout";
import Home from "./pages/Home";
import LogExericse from "./pages/LogExercise";
import History from "./pages/History";
import Workout from "./pages/Workout";
import Stats from "./pages/Stats";
import Exercises from "./pages/Exercises";
import ExerciseStats from "./pages/ExerciseStats";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <Router>
            <SettingsProvider>
                <WorkoutProvider>
                    <Routes>
                        <Route element={<DefaultLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/log-exercise" element={<LogExericse />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/history/:id" element={<Workout />} />
                            <Route path="/stats" element={<Stats />} />
                            <Route path="/stats/exercises" element={<Exercises />} />
                            <Route path="/stats/exercises/:id" element={<ExerciseStats />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/settings/about" element={<About />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </WorkoutProvider>
            </SettingsProvider>
        </Router>
    );
}
