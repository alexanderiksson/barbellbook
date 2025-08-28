import { useState, useMemo } from "react";
import { useWorkout } from "../context/WorkoutContext";
import exercisesData from "../data/exercises.json";

import PageHeading from "../components/common/PageHeading";
import { LinkButton } from "../components/common/Buttons";
import { Select } from "../components/common/Inputs";
import {
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
} from "recharts";

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
                        <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                            <h2 className="mb-6 text-text-grey text-sm">Monthly Workouts</h2>
                            <div className="w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={sessions}
                                        margin={{ top: 0, right: 10, left: -25, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                        <XAxis dataKey="month" fontSize={12} />
                                        <YAxis allowDecimals={false} fontSize={12} />
                                        <Tooltip />
                                        <Bar
                                            dataKey="Sessions"
                                            fill={getComputedStyle(
                                                document.documentElement
                                            ).getPropertyValue("--color-primary-bright")}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                            <h2 className="mb-6 text-text-grey text-sm">Monthly Exercises</h2>
                            <div className="w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={exercises}
                                        margin={{ top: 0, right: 10, left: -25, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                        <XAxis dataKey="month" fontSize={12} />
                                        <YAxis allowDecimals={false} fontSize={12} />
                                        <Tooltip />
                                        <Bar
                                            dataKey="Exercises"
                                            fill={getComputedStyle(
                                                document.documentElement
                                            ).getPropertyValue("--color-accent-bright")}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                            <h2 className="mb-6 text-text-grey text-sm">
                                Most Worked Muscle Groups
                            </h2>
                            <div className="w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="85%"
                                        data={mostTrainedBodyParts}
                                    >
                                        <PolarGrid opacity={0.5} />
                                        <PolarAngleAxis dataKey="name" fontSize={12} />

                                        <Radar
                                            dataKey="percentage"
                                            stroke={getComputedStyle(
                                                document.documentElement
                                            ).getPropertyValue("--color-primary-bright")}
                                            fill={getComputedStyle(
                                                document.documentElement
                                            ).getPropertyValue("--color-primary-bright")}
                                            fillOpacity={0.8}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

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
