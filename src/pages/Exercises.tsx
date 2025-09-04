import { useMemo, useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { Link } from "react-router-dom";
import exercisesData from "../data/exercises.json";

import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import { TextInput } from "../components/common/Inputs";

import { IoIosArrowForward } from "react-icons/io";

export default function Exercises() {
    const { workouts } = useWorkout();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Find the all exercises sorted by most logged
    const allExercises = useMemo(() => {
        const exerciseCount = workouts.reduce((acc, workout) => {
            workout.exercises.forEach((exercise) => {
                acc[exercise.name] = (acc[exercise.name] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(exerciseCount)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => {
                const exerciseData = exercisesData.find((e) => e.name === name);
                return {
                    id: exerciseData ? exerciseData.id : name,
                    name,
                    count,
                    category: exerciseData ? exerciseData["body-part"] : "Unknown",
                };
            });
    }, [workouts]);

    // Get unique categories
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(allExercises.map((exercise) => exercise.category))
        );
        return ["All", ...uniqueCategories.sort()];
    }, [allExercises]);

    // Filters
    const filteredExercises = useMemo(() => {
        let filtered = allExercises;

        if (selectedCategory !== "All") {
            filtered = filtered.filter((exercise) => exercise.category === selectedCategory);
        }

        if (search) {
            filtered = filtered.filter((exercise) =>
                exercise.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        return filtered;
    }, [allExercises, selectedCategory, search]);

    return (
        <div className="content">
            <BackButton to="/stats" label="Stats" />
            <PageHeading>Exercises</PageHeading>

            <div className="mb-8 flex flex-col gap-4">
                <div className="flex gap-2 overflow-auto py-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`py-1 px-4 rounded-full border transition-all duration-200 cursor-pointer ${
                                selectedCategory === category
                                    ? "bg-primary-bright text-background border-primary-bright"
                                    : "border-primary-bright hover:bg-primary-bright/10"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <TextInput
                    placeholder="Search exercise..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <p className="text-sm text-text-grey">
                    {filteredExercises.length > 1
                        ? `Showing ${filteredExercises.length} exercises`
                        : `Showing ${filteredExercises.length} exercise`}
                </p>
            </div>

            <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredExercises.map((exercise, index) => (
                        <Link key={index} to={`/stats/exercises/${exercise.id}`}>
                            <div className="flex justify-between items-center gap-4 p-3 bg-secondary rounded-xl border border-border/20">
                                <div className="flex flex-col gap-2">
                                    <h3 className="truncate">
                                        <span className="text-text-grey mr-2">{index + 1}.</span>
                                        {exercise.name}
                                    </h3>
                                    <span className="text-xs text-text-grey">
                                        {exercise.count > 1
                                            ? `${exercise.count} workouts`
                                            : `${exercise.count} workout`}
                                    </span>
                                </div>

                                <IoIosArrowForward size={20} color="grey" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
