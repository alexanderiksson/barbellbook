import { useState, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import WorkoutCard from "../components/pages/History/WorkoutCard";

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
            <PageHeading>History</PageHeading>

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
                    {filteredWorkouts.map((workout, index) => (
                        <WorkoutCard key={index} workout={workout} />
                    ))}
                </section>
            )}
        </div>
    );
}
