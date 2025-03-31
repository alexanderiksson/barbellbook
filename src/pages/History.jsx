import { useState, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { Link } from "react-router-dom";
import TrashIcon from "../assets/icons/TrashIcon";

export default function History() {
    const { workouts, removeWorkout } = useWorkout();
    const [initialWorkouts, setInitialWorkouts] = useState([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);
    const [filter, setFilter] = useState("new");

    useEffect(() => {
        const updatedWorkouts = workouts.map((workout, index) => ({
            id: index,
            date: workout.date,
            exercises: workout.exercises,
            name: workout.name,
        }));
        setInitialWorkouts(updatedWorkouts);
    }, [workouts]);

    useEffect(() => {
        const sortedWorkouts =
            filter === "new"
                ? [...initialWorkouts].reverse()
                : [...initialWorkouts];
        setFilteredWorkouts(sortedWorkouts);
    }, [filter, initialWorkouts]);

    return (
        <div className="content">
            <h1 className="text-3xl font-semibold mb-6">History</h1>

            <select
                className="py-2 w-full text-center border border-white/10 mb-8 rounded-lg bg-neutral-900 text-sm"
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
            >
                <option value="new">New to old</option>
                <option value="old">Old to new</option>
            </select>

            {workouts.length === 0 ? (
                <p className="text-neutral-500">No workouts found.</p>
            ) : (
                <section className="flex flex-col gap-4">
                    {filteredWorkouts.map((workout, index) => (
                        <div
                            key={index}
                            className="p-4 bg-neutral-900 border border-white/5 rounded-lg shadow-xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-semibold">
                                    {workout.name
                                        ? workout.name
                                        : `Workout #${workout.id + 1}`}
                                </h2>
                                <span className="text-neutral-500 text-xs">
                                    {workout.date}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <Link
                                    to={`/history/${workout.id + 1}`}
                                    className="bg-sky-700 px-4 py-2 rounded-lg inline-flex justify-center items-center cursor-pointer"
                                >
                                    View workout
                                </Link>
                                <button
                                    className="cursor-pointer flex items-end"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                "Are you sure you want to remove workout?"
                                            )
                                        ) {
                                            removeWorkout(index);
                                        }
                                    }}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
