import { useState, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import WorkoutCard from "../components/pages/History/WorkoutCard";
import Loader from "../components/common/Loader";
import MenuButton from "../components/common/MenuButton";
import Menu from "../components/common/Menu";

import { TbFileExport } from "react-icons/tb";
import { IoIosStats } from "react-icons/io";

interface Workouts {
    date: string;
    exercises: { name: string; sets: { reps: number; weight: string }[] }[];
    name?: string;
}

interface FilteredWorkouts extends Workouts {
    id: number;
}

export default function History() {
    const [loading, setLoading] = useState<boolean>(true);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const closeMenu = () => setIsOpen(false);

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
        setLoading(false);
    }, [filter, initialWorkouts]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="content relative">
            <PageHeading>History</PageHeading>

            <div className="flex gap-2 mb-8">
                <select
                    className="py-2 w-full text-center border border-white/10 rounded-xl bg-neutral-900 text-sm"
                    onChange={(e) => setFilter(e.target.value as "new" | "old")}
                    value={filter}
                >
                    <option value="new">New to old</option>
                    <option value="old">Old to new</option>
                </select>
                <div className="flex relative shrink-0">
                    <MenuButton onClick={() => setIsOpen((isOpen) => !isOpen)} />

                    {isOpen && (
                        <div
                            className="fixed inset-0 z-10 bg-black/50 backdrop-blur-xs"
                            onClick={() => setIsOpen(false)}
                        ></div>
                    )}

                    <Menu
                        isOpen={isOpen}
                        closeMenu={closeMenu}
                        menuItems={[
                            {
                                type: "link",
                                label: "Export data",
                                icon: TbFileExport,
                                to: "/export",
                            },
                            {
                                type: "link",
                                label: "Stats",
                                icon: IoIosStats,
                                to: "/stats",
                            },
                        ]}
                    />
                </div>
            </div>

            {workouts.length === 0 ? (
                <p className="text-neutral-500">No workouts found.</p>
            ) : (
                <section className="flex flex-col gap-3">
                    {filteredWorkouts.map((workout, index) => (
                        <WorkoutCard key={index} workout={workout} />
                    ))}
                </section>
            )}
        </div>
    );
}
