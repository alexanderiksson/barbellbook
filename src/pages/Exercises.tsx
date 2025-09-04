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
                };
            });
    }, [workouts]);

    // Search field
    const filteredExercises = useMemo(() => {
        if (!search) return allExercises;
        return allExercises.filter((exercise) =>
            exercise.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [allExercises, search]);

    return (
        <div className="content">
            <BackButton to="/stats" label="Stats" />
            <PageHeading>Exercises</PageHeading>

            <div className="mb-8">
                {/* Search field */}
                <TextInput
                    placeholder="Search exercise..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* Category filter */}
            </div>

            <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredExercises.map((exercise, index) => (
                        <Link key={index} to={`/stats/exercises/${exercise.id}`}>
                            <div className="flex justify-between items-center gap-4 p-3 bg-secondary rounded-xl border border-border/20">
                                <h3 className="truncate">
                                    <span className="text-text-grey mr-2">{index + 1}.</span>
                                    {exercise.name}
                                </h3>
                                <IoIosArrowForward size={20} color="grey" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
