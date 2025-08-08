import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import exercisesData from "../data/exercises.json";

import PageHeading from "../components/common/PageHeading";
import { Button } from "../components/common/Buttons";
import Chart from "../components/pages/Stats/BarChart";
import { Select } from "../components/common/Inputs";

import { IoIosArrowForward } from "react-icons/io";

export default function Stats() {
    const { workouts } = useWorkout();
    const [showAllExercises, setShowAllExercises] = useState(false);

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

    // Calculate chart data
    const calculateData = (key: "Sessions" | "Exercises") => {
        return Array.from(
            workouts.reduce((acc, workout) => {
                const workoutDate = new Date(workout.date);
                if (workoutDate.getFullYear().toString() === selectedYear) {
                    const month = workoutDate.toLocaleString("en-US", { month: "short" });
                    if (key === "Sessions") {
                        acc.set(month, (acc.get(month) || 0) + 1);
                    } else if (key === "Exercises") {
                        acc.set(month, (acc.get(month) || 0) + workout.exercises.length);
                    }
                }
                return acc;
            }, new Map<string, number>())
        ).map(([month, value]) => ({ month, [key]: value }));
    };

    const sessions = useMemo(() => calculateData("Sessions"), [workouts, selectedYear]);
    const exercises = useMemo(() => calculateData("Exercises"), [workouts, selectedYear]);

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

    // Calculate most trained body parts
    const mostTrainedBodyParts = useMemo(() => {
        const bodyPartCount = workouts.reduce((acc, workout) => {
            const workoutDate = new Date(workout.date);
            if (workoutDate.getFullYear().toString() === selectedYear) {
                workout.exercises.forEach((exercise) => {
                    const exerciseData = exercisesData.find((e) => e.name === exercise.name);
                    if (exerciseData) {
                        const bodyPart = exerciseData["body-part"];
                        acc[bodyPart] = (acc[bodyPart] || 0) + 1;
                    }
                });
            }
            return acc;
        }, {} as Record<string, number>);

        const total = Object.values(bodyPartCount).reduce((sum, count) => sum + count, 0);

        return Object.entries(bodyPartCount)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({
                name,
                percentage: total > 0 ? Math.round((count / total) * 100) : 0,
            }));
    }, [workouts, selectedYear]);

    return (
        <div className="content">
            <PageHeading>Your stats</PageHeading>

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

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                            <h2 className="mb-6 text-text-grey text-sm">Workouts</h2>
                            <Chart data={sessions} label="Sessions" />
                        </div>

                        <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                            <h2 className="mb-6 text-text-grey text-sm">Exercises</h2>
                            <Chart
                                data={exercises}
                                label="Exercises"
                                color={getComputedStyle(document.documentElement).getPropertyValue(
                                    "--color-accent-bright"
                                )}
                            />
                        </div>

                        <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                            <h2 className="mb-6 text-text-grey text-sm">Most trained body parts</h2>
                            <div className="flex flex-col divide-y divide-border/50">
                                {mostTrainedBodyParts.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center gap-4 py-2"
                                    >
                                        <h3 className="truncate">
                                            <span className="text-text-grey mr-2">
                                                {index + 1}.
                                            </span>
                                            {item.name}
                                        </h3>
                                        <span>{item.percentage} %</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                            <h2 className="mb-6 text-text-grey text-sm">Favorite exercises</h2>
                            <div className="flex flex-col mb-6 gap-4">
                                {(showAllExercises ? allExercises : allExercises.slice(0, 3)).map(
                                    (exercise, index) => (
                                        <Link key={index} to={`/stats/exercise/${exercise.id}`}>
                                            <div className="flex justify-between items-center gap-4 py-3 px-4 bg-secondary-bright rounded-full border border-border/20">
                                                <h3 className="truncate">
                                                    <span className="text-text-grey mr-2">
                                                        {index + 1}.
                                                    </span>
                                                    {exercise.name}
                                                </h3>
                                                <IoIosArrowForward size={20} color="gray" />
                                            </div>
                                        </Link>
                                    )
                                )}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowAllExercises((prev) => !prev)}
                            >
                                {showAllExercises ? "Show less" : "Show all"}
                            </Button>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
