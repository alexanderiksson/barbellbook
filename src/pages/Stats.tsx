import { useState, useMemo } from "react";
import { useWorkout } from "../context/WorkoutContext";
import exercisesData from "../data/exercises.json";

import PageHeading from "../components/common/PageHeading";
import { LinkButton } from "../components/common/Buttons";
import { Select } from "../components/common/Inputs";
import MonthlyWorkouts from "../components/pages/Stats/MonthlyWorkouts";
import MostWorkedMuscleGroups from "../components/pages/Stats/MostWorkedMuscleGroups";
import WorkoutsPerWeekday from "../components/pages/Stats/WorkoutsPerWeekday";

export default function Stats() {
    const { workouts } = useWorkout();

    // Find years from the logged workouts
    const years = useMemo(
        () =>
            Array.from(
                new Set(workouts.map((workout) => new Date(workout.date).getFullYear()))
            ).sort((a, b) => b - a),
        [workouts]
    );

    const initialSelectedYear = years.length > 0 ? years[0].toString() : "";
    const [selectedYear, setSelectedYear] = useState<string>(initialSelectedYear);

    // Calculate favorite exercises
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
            <PageHeading>Your Stats</PageHeading>

            {workouts.length <= 0 ? (
                <p className="text-neutral-500">No workouts found.</p>
            ) : (
                <>
                    <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {years.map((year, index) => (
                            <option key={index} value={year}>
                                {year === new Date().getFullYear() ? "This year" : year}
                            </option>
                        ))}
                    </Select>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <MonthlyWorkouts workouts={workouts} year={selectedYear} />
                        <WorkoutsPerWeekday workouts={workouts} year={selectedYear} />
                        <MostWorkedMuscleGroups workouts={workouts} year={selectedYear} />

                        <div className="bg-secondary p-4 rounded-2xl border border-border/20 flex flex-col justify-between">
                            <h2 className="mb-6 text-text-grey text-sm">Your Top Exercises</h2>
                            <div className="flex flex-col mb-6 gap-4">
                                {allExercises.slice(0, 3).map((exercise, index) => (
                                    <div key={index}>
                                        <h3 className="truncate">
                                            <span className="text-text-grey mr-2">
                                                {index + 1}.
                                            </span>
                                            {exercise.name}
                                        </h3>
                                    </div>
                                ))}
                            </div>

                            <LinkButton to="/stats/exercises" variant="blue">
                                Show all
                            </LinkButton>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
