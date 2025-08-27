import { useMemo } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { Link } from "react-router-dom";
import exercisesData from "../data/exercises.json";

import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";

import { IoIosArrowForward } from "react-icons/io";

export default function Exercises() {
    const { workouts } = useWorkout();

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

    return (
        <div className="content">
            <BackButton to="/stats" label="Stats" />
            <PageHeading>Exercises</PageHeading>

            <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {allExercises.map((exercise, index) => (
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
