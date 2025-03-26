import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import AddExercise from "./pages/AddExercise";
import { WorkoutProvider } from "./context/WorkoutContext";

export default function App() {
    return (
        <Router>
            <WorkoutProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/workout" element={<Workout />} />
                        <Route path="/add-exercise" element={<AddExercise />} />
                    </Route>
                </Routes>
            </WorkoutProvider>
        </Router>
    );
}
