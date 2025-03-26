import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Workout from "./pages/Workout";
import AddExercise from "./pages/AddExercise";
import { WorkoutProvider } from "./context/WorkoutContext";

export default function App() {
    return (
        <Router>
            <WorkoutProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Workout />} />
                        <Route path="/add-exercise" element={<AddExercise />} />
                    </Route>
                </Routes>
            </WorkoutProvider>
        </Router>
    );
}
