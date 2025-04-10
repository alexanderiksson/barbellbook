import { useState, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { Link } from "react-router-dom";
import dateConverter from "../utils/dateConverter";
import GymIcon from "../assets/icons/GymIcon";

// Define types for Workout and FilteredWorkout
interface Workouts {
    date: string;
    exercises: { name: string; sets: { reps: number; weight: number }[] }[];
    name?: string;
}

interface FilteredWorkouts extends Workouts {
    id: number;
}

export default function History() {
    const { workouts } = useWorkout();
    const [initialWorkouts, setInitialWorkouts] = useState<FilteredWorkouts[]>([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState<FilteredWorkouts[]>([]);
    const [filter, setFilter] = useState<"new" | "old">("new");

    useEffect(() => {
        const updatedWorkouts: FilteredWorkouts[] = workouts.map((workout, index) => ({
            id: index,
            date: workout.date,
            exercises: workout.exercises,
            name: workout.name,
        }));
        setInitialWorkouts(updatedWorkouts);
    }, [workouts]);

    useEffect(() => {
        const sortedWorkouts =
            filter === "new" ? [...initialWorkouts].reverse() : [...initialWorkouts];
        setFilteredWorkouts(sortedWorkouts);
    }, [filter, initialWorkouts]);

    return (
        <div className="content">
            <h1 className="text-3xl font-semibold mb-6">History</h1>

            <select
                className="py-2 w-full text-center border border-white/10 mb-8 rounded-lg bg-neutral-900 text-sm"
                onChange={(e) => setFilter(e.target.value as "new" | "old")}
                value={filter}
            >
                <option value="new">New to old</option>
                <option value="old">Old to new</option>
            </select>

            {workouts.length === 0 ? (
                <p className="text-neutral-500">No workouts found.</p>
            ) : (
                <section className="flex flex-col gap-2">
                    {filteredWorkouts.map((workout) => (
                        <Link to={`/history/${workout.id}`} key={workout.id}>
                            <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg shadow-xl flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-500/10 w-12 h-12 flex justify-center items-center rounded-full">
                                        <GymIcon size="24px" color="#10b981" />
                                    </div>

                                    <h2 className="text-lg font-semibold">
                                        {workout.name ? workout.name : "Workout"}
                                    </h2>
                                </div>

                                <span className="text-neutral-500 text-sm">
                                    {dateConverter(workout.date)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </section>
            )}
        </div>
    );
}
