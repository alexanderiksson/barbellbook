import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { useSettings } from "../context/SettingsContext";
import exercisesData from "../data/exercises.json";
import { WorkoutType } from "../types/workout";
import calculate1RM from "../utils/calculate1RM";

import PageHeading from "../components/common/PageHeading";
import { Select } from "../components/common/Inputs";
import WeightProgress from "../components/pages/ExerciseStats/WeightProgress";
import PersonalRecords from "../components/pages/ExerciseStats/PersonalRecords";
import Error from "../components/common/Error";
import Header from "../components/layout/Header";

export default function ExerciseStats() {
    const { id } = useParams<{ id: string }>();
    const { workouts } = useWorkout();
    const { weightUnit } = useSettings();

    const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
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
            workouts
                .filter((workout) => workout.exercises.some((ex) => ex.name === exercise.name))
                .map((workout) => {
                    const exerciseData = workout.exercises.find((ex) => ex.name === exercise.name);
                    return {
                        date: workout.date,
                        name: workout.name,
                        log: workout.log,
                        exercises: exerciseData ? [exerciseData] : [],
                    };
                })
                .filter((workout) => workout.exercises.length > 0),
        [workouts, exercise.name]
    );

    // Find the years from the logged data
    const years = useMemo(
        () =>
            Array.from(new Set(allWorkouts.map((item) => new Date(item.date).getFullYear()))).sort(
                (a, b) => b - a
            ),
        [allWorkouts]
    );

    // Filter the data based on what time period is selected
    useEffect(() => {
        if (selectedPeriod === "all") {
            setFilteredData(allWorkouts);
            return;
        }

        const now = new Date();
        let cutoffDate: Date;

        switch (selectedPeriod) {
            case "1-month":
                cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
            case "3-months":
                cutoffDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                break;
            case "6-months":
                cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                break;
            case "1-year":
                cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
            default:
                setFilteredData(
                    allWorkouts.filter(
                        (workout) => new Date(workout.date).getFullYear() === Number(selectedPeriod)
                    )
                );
                return;
        }

        setFilteredData(allWorkouts.filter((workout) => new Date(workout.date) >= cutoffDate));
    }, [selectedPeriod, allWorkouts]);

    // Calculate estimate 1RM
    const allOneRM = filteredData.flatMap((workout) => {
        const exerciseData = workout.exercises[0];
        if (!exerciseData) return [];

        return exerciseData.sets.map((set) => {
            const weight = Number(set.weight);
            const reps = Number(set.reps);
            return calculate1RM(weight, reps);
        });
    });
    const estimatedOneRM = allOneRM.length > 0 ? Math.max(...allOneRM).toFixed(1) : "0";

    // Find all sets
    const allSets = filteredData.flatMap((workout) => {
        const ex = workout.exercises[0];
        return ex ? ex.sets : [];
    });

    const allReps = allSets.flatMap((set) => {
        return set.reps;
    });

    return (
        <div className="content">
            <Header backLink="/stats?tab=exercises" />

            <PageHeading>{exercise.name}</PageHeading>

            <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                <option value="all">All time</option>
                <option value="1-month">Last month</option>
                <option value="3-months">Last 3 months</option>
                <option value="6-months">Last 6 months</option>
                <option value="1-year">Last year</option>

                {years.map((year, index) => (
                    <option key={index} value={year}>
                        {new Date().getFullYear() == year ? "This year" : year}
                    </option>
                ))}
            </Select>

            {filteredData.length === 0 ? (
                <p className="text-center">No records for this period</p>
            ) : (
                <section className="grid grid-cols-1 gap-4 mb-8">
                    <div className="bg-[var(--secondary)] p-4 rounded-[var(--radius)] border border-[var(--border)]/20">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            <div>
                                <h3 className="text-[var(--text-grey)] text-sm">Total Workouts</h3>
                                <span>{filteredData.length}</span>
                            </div>

                            <div>
                                <h3 className="text-[var(--text-grey)] text-sm">Estimated 1RM</h3>
                                <span>
                                    {estimatedOneRM} {weightUnit}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-[var(--text-grey)] text-sm">
                                    Avg. Sets/Workout
                                </h3>
                                <span>
                                    {(allSets.length / filteredData.length).toFixed(1)} sets
                                </span>
                            </div>

                            <div>
                                <h3 className="text-[var(--text-grey)] text-sm">Avg. Reps/Set</h3>
                                <span>
                                    {(
                                        allReps.reduce((acc, num) => acc + num, 0) / allSets.length
                                    ).toFixed(1)}{" "}
                                    reps
                                </span>
                            </div>
                        </div>
                    </div>

                    <WeightProgress workouts={filteredData} />
                    <PersonalRecords workouts={filteredData} />
                </section>
            )}
        </div>
    );
}
