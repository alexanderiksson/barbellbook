import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { useSettings } from "../context/SettingsContext";
import exercisesData from "../data/exercises.json";

import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import Chart from "../components/pages/Stats/LineChart";
import { Select } from "../components/common/Inputs";
import Error from "../components/common/Error";

export default function ExerciseStats() {
    const { id } = useParams<{ id: string }>();
    const { workouts } = useWorkout();
    const { weightUnit } = useSettings();

    // Find the exercise from the param
    const exercise = useMemo(() => {
        const isNumeric = !isNaN(Number(id));
        const exerciseEntry = isNumeric
            ? exercisesData.find((ex) => ex.id === Number(id))
            : exercisesData.find((ex) => ex.name.toLowerCase() === id?.toLowerCase());

        if (exerciseEntry) {
            return exerciseEntry.name;
        }

        // Fallback to user-entered exercises in workouts
        const userExercise = workouts
            .flatMap((workout) => workout.exercises)
            .find((ex) => ex.name.toLowerCase() === id?.toLowerCase());

        return userExercise ? userExercise.name : null;
    }, [id, workouts]);

    // Find logged data from the exercise
    const data = workouts
        .filter((workout) => workout.exercises.some((ex) => ex.name === exercise))
        .map((workout) => {
            const exerciseData = workout.exercises.find((ex) => ex.name === exercise);
            const maxWeightSet = exerciseData
                ? exerciseData.sets.reduce((maxSet, currentSet) =>
                      Number(currentSet.weight) > Number(maxSet.weight) ? currentSet : maxSet
                  )
                : { weight: 0, reps: 0 };
            return {
                date: new Date(workout.date).toLocaleDateString(),
                Weight: Number(maxWeightSet.weight),
                Reps: Number(maxWeightSet.reps),
            };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [filteredData, setFilteredData] = useState<
        { date: string; Weight: number; Reps: number }[]
    >([]);

    // Find the years from the logged data
    const years = useMemo(
        () =>
            Array.from(new Set(data.map((item) => new Date(item.date).getFullYear()))).sort(
                (a, b) => b - a
            ),
        [workouts]
    );

    // Filter the data based on what year is selected
    useEffect(() => {
        if (selectedYear === "all") {
            setFilteredData(data);
        } else {
            setFilteredData(
                data.filter((ex) => new Date(ex.date).getFullYear() === Number(selectedYear))
            );
        }
    }, [selectedYear]);

    // Calculate 1RM from the filtered data
    const calculate1RM = useMemo(() => {
        return (filteredData: { date: string; Weight: number; Reps: number }[]): string => {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            const recentData = filteredData.filter((item) => new Date(item.date) >= threeMonthsAgo);

            if (recentData.length < 3) {
                return "-";
            }

            const oneRepMaxes = recentData.map((item) => {
                const { Weight, Reps } = item;
                if (Reps === 1) {
                    // Direct 1RM
                    return Weight;
                } else if (Reps >= 2 && Reps <= 10) {
                    // Epley formula
                    return Weight * (1 + Reps / 30);
                } else if (Reps > 10 && Reps <= 20) {
                    // Lombardi formula
                    return Weight * Math.pow(Reps, 0.1);
                } else {
                    // Brzycki formula
                    return Weight * (36 / (37 - Reps));
                }
            });

            const maxOneRepMax = Math.max(...oneRepMaxes);
            return `${Math.round(maxOneRepMax * 10) / 10} ${weightUnit}`;
        };
    }, [filteredData]);

    if (!exercise) return <Error msg="Exercise not found" />;

    return (
        <div className="content">
            <BackButton label="Stats" to="/stats" />
            <PageHeading>{exercise}</PageHeading>

            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="all">All time</option>
                {years.map((year, index) => (
                    <option key={index} value={year}>
                        {year}
                    </option>
                ))}
            </Select>

            <section className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-secondary p-4 rounded-2xl border border-border/20 flex flex-col items-center text-center gap-1">
                    <h2 className="text-text-grey text-sm">Personal best</h2>
                    <span>
                        {Math.max(...filteredData.map((item) => item.Weight))} {weightUnit}
                    </span>
                </div>
                <div className="bg-secondary p-4 rounded-2xl border border-border/20 flex flex-col items-center text-center gap-1">
                    <h2 className="text-text-grey text-sm">Estimated 1RM *</h2>
                    <span>{calculate1RM(filteredData)}</span>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 mb-8">
                <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                    <div className="flex justify-between items-center gap-x-4 gap-y-2 flex-wrap mb-6">
                        <h2 className="text-text-grey text-sm">Weight progress ({weightUnit})</h2>
                        <span className="text-text-grey text-sm">
                            {filteredData.length} sessions
                        </span>
                    </div>
                    <Chart data={filteredData} label="Weight" />
                </div>
            </section>

            <p className="text-xs text-text-grey">
                * Estimated 1RM is calculated from your best results in the last 3 months.
            </p>
        </div>
    );
}
