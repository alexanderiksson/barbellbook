import { useState, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { WorkoutType } from "../types/workout";

import PageHeading from "../components/common/PageHeading";
import WorkoutCard from "../components/pages/History/WorkoutCard";
import Loader from "../components/common/Loader";
import MenuButton from "../components/common/MenuButton";
import Menu from "../components/common/Menu";
import { Select } from "../components/common/Inputs";

import { TbFileExport } from "react-icons/tb";
import { IoIosStats, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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

    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 20;
    const paginatedWorkouts = filteredWorkouts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredWorkouts.length / itemsPerPage);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="content relative flex flex-col flex-1">
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
                    <Select
                        onChange={(e) => setFilter(e.target.value as "new" | "old")}
                        value={filter}
                    >
                        <option value="new">New to old</option>
                        <option value="old">Old to new</option>
                    </Select>

                    <section className="flex flex-col gap-3 flex-1">
                        {paginatedWorkouts.map((workout, index) => (
                            <WorkoutCard key={index} workout={workout} />
                        ))}

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-auto pt-4 mb-4 gap-6">
                                <button
                                    className="bg-zinc-800 p-2 rounded-full cursor-pointer"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                >
                                    <IoIosArrowBack size={24} />
                                </button>
                                <span className="text-neutral-300">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="bg-zinc-800 p-2 rounded-full cursor-pointer"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                >
                                    <IoIosArrowForward size={24} />
                                </button>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
