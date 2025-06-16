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
                        <option value="new">Sort by: Latest</option>
                        <option value="old">Sort by: Oldest</option>
                    </Select>

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {paginatedWorkouts.map((workout, index) => (
                            <WorkoutCard key={index} workout={workout} />
                        ))}
                    </section>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-auto pt-4 mb-4 gap-6">
                            <button
                                className={`${
                                    currentPage === 1
                                        ? "bg-zinc-900 cursor-not-allowed"
                                        : "bg-zinc-800 cursor-pointer"
                                } p-3 rounded-full `}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                <IoIosArrowBack
                                    size={20}
                                    color={currentPage === 1 ? "gray" : "white"}
                                />
                            </button>
                            <span className="text-neutral-300">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className={`${
                                    currentPage === totalPages
                                        ? "bg-zinc-900 cursor-not-allowed"
                                        : "bg-zinc-800 cursor-pointer"
                                } p-3 rounded-full `}
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                <IoIosArrowForward
                                    size={20}
                                    color={currentPage === totalPages ? "gray" : "white"}
                                />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
