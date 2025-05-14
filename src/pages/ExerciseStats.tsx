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
            const maxWeight = exerciseData
                ? Math.max(...exerciseData.sets.map((set) => Number(set.weight)))
                : 0;
            return {
                date: workout.date,
                Weight: maxWeight,
            };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [filteredData, setFilteredData] = useState<{ date: string; Weight: number }[]>([]);

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

            <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/3">
                <h2 className="font-medium mb-6 text-neutral-400">Highest weight (kg)</h2>
                <Chart data={filteredData} />
            </div>
        </div>
    );
}
