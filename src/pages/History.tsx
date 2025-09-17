import { useState, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { WorkoutType } from "../types/workout";

import WorkoutCard from "../components/pages/History/WorkoutCard";
import Loader from "../components/common/Loader";
import { Select } from "../components/common/Inputs";
import Header from "../components/layout/Header";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface FilteredWorkouts extends WorkoutType {
    id: number;
}

export default function History() {
    const [loading, setLoading] = useState<boolean>(true);

    const { workouts } = useWorkout();
    const [initialWorkouts, setInitialWorkouts] = useState<FilteredWorkouts[]>([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState<FilteredWorkouts[]>([]);
    const [filter, setFilter] = useState<"new" | "old">("new");

    // Get all the workouts from storage
    useEffect(() => {
        const updatedWorkouts: FilteredWorkouts[] = workouts.map((workout, index) => ({
            id: index,
            date: workout.date,
            exercises: workout.exercises,
            name: workout.name,
        }));
        setInitialWorkouts(updatedWorkouts);
    }, [workouts]);

    // Sort workouts based on sort filter
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

    // Show loader if loading
    if (loading) return <Loader />;

    return (
        <div className="content relative flex flex-col flex-1">
            <Header title="History" />

            {workouts.length === 0 ? (
                <p className="text-[var(--text-grey)]">No workouts logged yet.</p>
            ) : (
                <>
                    <Select
                        onChange={(e) => setFilter(e.target.value as "new" | "old")}
                        value={filter}
                        className="mb-6"
                    >
                        <option value="new">Most recent</option>
                        <option value="old">Least recent</option>
                    </Select>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {paginatedWorkouts.map((workout, index) => (
                            <WorkoutCard key={index} workout={workout} />
                        ))}
                    </section>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-auto pt-4 mb-4 gap-6">
                            <button
                                className={`${
                                    currentPage === 1
                                        ? "bg-[var(--secondary)] cursor-not-allowed"
                                        : "bg-[var(--secondary-bright)] cursor-pointer"
                                } p-3 rounded-full `}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                <IoIosArrowBack
                                    size={20}
                                    color={currentPage === 1 ? "gray" : "white"}
                                />
                            </button>
                            <span className="text-[var(--text-grey)]">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className={`${
                                    currentPage === totalPages
                                        ? "bg-[var(--secondary)] cursor-not-allowed"
                                        : "bg-[var(--secondary-bright)] cursor-pointer"
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
