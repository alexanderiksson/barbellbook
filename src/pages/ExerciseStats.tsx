import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { useSettings } from "../context/SettingsContext";
import exercisesData from "../data/exercises.json";
import { WorkoutType } from "../types/workout";

import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import { Select } from "../components/common/Inputs";
import Error from "../components/common/Error";

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

        return exerciseEntry.name;
    }, [id, workouts]);

    // Finds all workouts that contains the exercise
    const allWorkouts = workouts.filter((workout) =>
        workout.exercises.some((ex) => ex.name === exercise)
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
        } else {
            setFilteredData(
                allWorkouts.filter(
                    (workout) => new Date(workout.date).getFullYear() === Number(selectedYear)
                )
            );
        }
    }, [selectedYear]);

    // Find personal records
    const personalRecords = (data: WorkoutType[]) => {
        const bestResults: {
            [rep: number]: { weight: number; reps: number; date: string } | null;
        } = {};
        for (let rep = 1; rep <= 10; rep++) {
            let bestSet: { weight: number; reps: number; date: string } | null = null;
            data.forEach((workout) => {
                workout.exercises
                    .filter((ex) => ex.name === exercise)
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

    if (!exercise) return <Error msg="Exercise not found" />;

    return (
        <div className="content">
            <BackButton label="Exercises" to="/stats/exercises" />
            <PageHeading>{exercise}</PageHeading>

            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="all">All time</option>
                {years.map((year, index) => (
                    <option key={index} value={year}>
                        {year}
                    </option>
                ))}
            </Select>

            <section className="grid grid-cols-1 gap-4 mb-8">
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
