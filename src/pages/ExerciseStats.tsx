import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import Chart from "../components/pages/Stats/LineChart";
import { Select } from "../components/common/Inputs";

export default function ExerciseStats() {
    const { exercise } = useParams<{ exercise: string }>();
    const { workouts } = useWorkout();

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
                date: workout.date,
                Weight: Number(maxWeightSet.weight),
                Reps: Number(maxWeightSet.reps),
            };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [filteredData, setFilteredData] = useState<
        { date: string; Weight: number; Reps: number }[]
    >([]);

    const years = useMemo(
        () =>
            Array.from(new Set(data.map((item) => new Date(item.date).getFullYear()))).sort(
                (a, b) => b - a
            ),
        [workouts]
    );

    useEffect(() => {
        if (selectedYear === "all") {
            setFilteredData(data);
        } else {
            setFilteredData(
                data.filter((ex) => new Date(ex.date).getFullYear() === Number(selectedYear))
            );
        }
    }, [selectedYear]);

    const calculateProjected1RM = useMemo(() => {
        return (data: { date: string; Weight: number; Reps: number }[]): string => {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            const recentData = data.filter((item) => new Date(item.date) >= threeMonthsAgo);

            if (recentData.length < 3) {
                return "-";
            }

            const oneRepMaxes = recentData.map((item) => {
                const { Weight, Reps } = item;
                return Weight * (1 + Reps / 30);
            });

            const maxOneRepMax = Math.max(...oneRepMaxes);
            return `${Math.round(maxOneRepMax * 10) / 10} kg`;
        };
    }, [data]);

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
                <div className="bg-secondary p-4 rounded-2xl border border-border/20 flex flex-col items-center">
                    <h2 className="font-medium text-text-grey">Personal best</h2>
                    <span>{Math.max(...data.map((item) => item.Weight))} kg</span>
                </div>
                <div className="bg-secondary p-4 rounded-2xl border border-border/20 flex flex-col items-center">
                    <h2 className="font-medium text-text-grey">Projected 1RM</h2>
                    <span>{calculateProjected1RM(data)}</span>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                    <div className="flex justify-between items-center gap-x-4 gap-y-2 flex-wrap mb-6">
                        <h2 className="font-medium text-text-grey">Highest weight (kg)</h2>
                        <span className="text-text-grey text-sm">
                            {filteredData.length} sessions
                        </span>
                    </div>
                    <Chart data={filteredData} label="Weight" />
                </div>

                <div className="bg-secondary p-4 rounded-2xl border border-border/20">
                    <div className="flex justify-between items-center gap-x-4 gap-y-2 flex-wrap mb-6">
                        <h2 className="font-medium text-text-grey">Reps (top set)</h2>
                        <span className="text-text-grey text-sm">
                            {filteredData.length} sessions
                        </span>
                    </div>
                    <Chart
                        data={filteredData}
                        label="Reps"
                        color={getComputedStyle(document.documentElement).getPropertyValue(
                            "--color-accent-bright"
                        )}
                    />
                </div>
            </section>
        </div>
    );
}
