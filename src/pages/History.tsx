import { useState, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { WorkoutType } from "../types/workout";

import PageHeading from "../components/common/PageHeading";
import WorkoutCard from "../components/pages/History/WorkoutCard";
import Loader from "../components/common/Loader";
import MenuButton from "../components/common/MenuButton";
import Menu from "../components/common/Menu";

import { TbFileExport } from "react-icons/tb";
import { IoIosStats } from "react-icons/io";

interface FilteredWorkouts extends WorkoutType {
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
        const sortedWorkouts = [...initialWorkouts].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return filter === "new" ? dateB - dateA : dateA - dateB;
        });
        setFilteredWorkouts(sortedWorkouts);
        setLoading(false);
    }, [filter, initialWorkouts]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="content relative">
            <div className="flex justify-between mb-8">
                <PageHeading>Workout history</PageHeading>
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
                                label: "Stats",
                                icon: IoIosStats,
                                to: "/stats",
                            },
                            {
                                type: "link",
                                label: "Export data",
                                icon: TbFileExport,
                                to: "/export",
                            },
                        ]}
                    />
                </div>
            </div>

            {workouts.length === 0 ? (
                <p className="text-neutral-500">No workouts found.</p>
            ) : (
                <>
                    <select
                        className="py-2 w-full text-center border border-white/10 rounded-2xl bg-zinc-900 text-sm mb-4"
                        onChange={(e) => setFilter(e.target.value as "new" | "old")}
                        value={filter}
                    >
                        <option value="new">New to old</option>
                        <option value="old">Old to new</option>
                    </select>

                    <section className="flex flex-col gap-3">
                        {filteredWorkouts.map((workout, index) => (
                            <WorkoutCard key={index} workout={workout} />
                        ))}
                    </section>
                </>
            )}
        </div>
    );
}
