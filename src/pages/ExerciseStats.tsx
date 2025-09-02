import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { useSettings } from "../context/SettingsContext";
import exercisesData from "../data/exercises.json";
import { WorkoutType } from "../types/workout";
import calculate1RM from "../utils/calculate1RM";

import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import { Select } from "../components/common/Inputs";
import Error from "../components/common/Error";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export default function ExerciseStats() {
    const { id } = useParams<{ id: string }>();
    const { workouts } = useWorkout();
    const { weightUnit } = useSettings();

    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [filteredData, setFilteredData] = useState<WorkoutType[]>([]);

    // Find the exercise from the param
    const exercise = useMemo(() => {
        const isNumeric = !isNaN(Number(id));
        const exerciseEntry = isNumeric
            ? exercisesData.find((ex) => ex.id === Number(id))
            : exercisesData.find((ex) => ex.name.toLowerCase() === id?.toLowerCase());

        if (!exerciseEntry) {
            return null;
        }

        return { name: exerciseEntry.name, category: exerciseEntry["body-part"] };
    }, [id, workouts]);

    if (!exercise) return <Error msg="Exercise not found" />;

    // Finds all workouts that contains the exercise
    const allWorkouts = useMemo(
        () =>
            workouts.filter((workout) => workout.exercises.some((ex) => ex.name === exercise.name)),
        [workouts, exercise.name]
    );

    // Find the years from the logged data
    const years = useMemo(
        () =>
            Array.from(new Set(allWorkouts.map((item) => new Date(item.date).getFullYear()))).sort(
                (a, b) => b - a
            ),
        [workouts]
    );

    // Filter the data based on what year is selected
    useEffect(() => {
        if (selectedYear === "all") {
            setFilteredData(allWorkouts);
        } else if (selectedYear === "month") {
            // Filter workouts from the last month
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            setFilteredData(allWorkouts.filter((workout) => new Date(workout.date) >= oneMonthAgo));
        } else if (selectedYear === "3-months") {
            // Filter workouts from the last 3 months
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            setFilteredData(
                allWorkouts.filter((workout) => new Date(workout.date) >= threeMonthsAgo)
            );
        } else {
            setFilteredData(
                allWorkouts.filter(
                    (workout) => new Date(workout.date).getFullYear() === Number(selectedYear)
                )
            );
        }
    }, [selectedYear, allWorkouts]);

    // Find personal records
    const personalRecords = (data: WorkoutType[]) => {
        const bestResults: {
            [rep: number]: { weight: number; reps: number; date: string } | null;
        } = {};
        for (let rep = 1; rep <= 10; rep++) {
            let bestSet: { weight: number; reps: number; date: string } | null = null;
            data.forEach((workout) => {
                workout.exercises
                    .filter((ex) => ex.name === exercise.name)
                    .forEach((ex) => {
                        ex.sets.forEach((set) => {
                            if (Number(set.reps) === rep) {
                                const weightNum = Number(set.weight);
                                if (!bestSet || weightNum > bestSet.weight) {
                                    bestSet = {
                                        weight: weightNum,
                                        reps: Number(set.reps),
                                        date: workout.date,
                                    };
                                }
                            }
                        });
                    });
            });
            bestResults[rep] = bestSet;
        }
        return bestResults;
    };

    const data = filteredData
        .filter((workout) => workout.exercises.some((ex) => ex.name === exercise.name))
        .map((workout) => {
            const exerciseData = workout.exercises.find((ex) => ex.name === exercise.name);
            if (!exerciseData) {
                return {
                    date: new Date(workout.date).toLocaleDateString(),
                    Weight: 0,
                    Reps: 0,
                };
            }

            const maxWeight = Math.max(...exerciseData.sets.map((set) => Number(set.weight)));

            const maxWeightSets = exerciseData.sets.filter(
                (set) => Number(set.weight) === maxWeight
            );
            const maxRepsAtMaxWeight = Math.max(...maxWeightSets.map((set) => Number(set.reps)));

            return {
                date: new Date(workout.date).toLocaleDateString(),
                Weight: maxWeight,
                Reps: maxRepsAtMaxWeight,
            };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate estimate 1RM
    const allOneRM = data.map((item) => {
        const { Weight, Reps } = item;
        return calculate1RM(Weight, Reps);
    });
    const estimatedOneRM = Math.max(...allOneRM).toFixed(1);

    // Find all sets
    const allSets = filteredData.flatMap((workout) => {
        const ex = workout.exercises.find((ex) => ex.name === exercise.name);
        return ex ? ex.sets : [];
    });

    const allReps = allSets.flatMap((set) => {
        return set.reps;
    });

    return (
        <div className="content">
            <BackButton label="Exercises" to="/stats/exercises" />
            <PageHeading>{exercise.name}</PageHeading>

            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="all">All time</option>
                <option value="month">Last month</option>
                <option value="3-months">Last 3 months</option>
                {years.map((year, index) => (
                    <option key={index} value={year}>
                        {new Date().getFullYear() == year ? "This year" : year}
                    </option>
                ))}
            </Select>

            <section className="grid grid-cols-1 gap-4 mb-8">
                <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        <div>
                            <h3 className="text-text-grey text-sm">Total Workouts</h3>
                            <span>{filteredData.length}</span>
                        </div>

                        <div>
                            <h3 className="text-text-grey text-sm">Estimated 1RM</h3>
                            <span>
                                {estimatedOneRM} {weightUnit}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-text-grey text-sm">Avg. Sets/Workout</h3>
                            <span>{(allSets.length / filteredData.length).toFixed(1)} sets</span>
                        </div>

                        <div>
                            <h3 className="text-text-grey text-sm">Avg. Reps/Set</h3>
                            <span>
                                {(
                                    allReps.reduce((acc, num) => acc + num, 0) / allSets.length
                                ).toFixed(1)}{" "}
                                reps
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                    <h2 className="text-text-grey text-sm mb-6">Weight Progress</h2>
                    <div className="w-full h-80 lg:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{
                                    top: 0,
                                    right: -42,
                                    left: -25,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis
                                    yAxisId="left"
                                    fontSize={12}
                                    domain={["dataMin - 1", "dataMax + 1"]}
                                    allowDecimals={false}
                                />
                                <YAxis
                                    yAxisId="right"
                                    fontSize={12}
                                    orientation="right"
                                    domain={["dataMin - 1", "dataMax + 1"]}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: getComputedStyle(
                                            document.documentElement
                                        ).getPropertyValue("--color-background"),
                                        borderRadius: "16px",
                                        border: "none",
                                        color: "lightgray",
                                    }}
                                    formatter={(value, name) => {
                                        if (name === "Weight") {
                                            return `${value} ${weightUnit}`;
                                        }
                                        return value;
                                    }}
                                />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="bump"
                                    dataKey="Weight"
                                    stroke={getComputedStyle(
                                        document.documentElement
                                    ).getPropertyValue("--color-primary-bright")}
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                />
                                <Line
                                    yAxisId="right"
                                    type="stepAfter"
                                    dataKey="Reps"
                                    stroke={getComputedStyle(
                                        document.documentElement
                                    ).getPropertyValue("--color-accent-bright")}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                    <h2 className="text-text-grey text-sm mb-6">Personal Records</h2>
                    <div className="flex flex-col gap-2 divide-y divide-border/50">
                        {Object.entries(personalRecords(filteredData)).map(
                            ([rep, record], index) => (
                                <div key={index} className="flex items-center justify-between py-2">
                                    <span>{rep} RM</span>
                                    {record ? (
                                        <>
                                            <span>
                                                {record.weight}
                                                <span className="text-text-grey ml-1">
                                                    {weightUnit}
                                                </span>
                                            </span>
                                            <span className="w-24">
                                                {new Date(record.date).toLocaleDateString()}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span>-</span>
                                            <span className="text-text-grey w-24">Not logged</span>
                                        </>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
