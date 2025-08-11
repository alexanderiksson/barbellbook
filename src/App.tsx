import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { WorkoutProvider } from "./context/WorkoutContext";
import { SettingsProvider } from "./context/SettingsContext";

import Layout from "./Layout";
import Home from "./pages/Home";
import AddExercise from "./pages/AddExercise";
import History from "./pages/History";
import Workout from "./pages/Workout";
import Stats from "./pages/Stats";
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
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/add-exercise" element={<AddExercise />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/history/:id" element={<Workout />} />
                            <Route path="/stats" element={<Stats />} />
                            <Route path="/stats/exercise/:id" element={<ExerciseStats />} />
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
