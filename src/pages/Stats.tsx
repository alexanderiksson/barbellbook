import { useState, useMemo } from "react";
import { useWorkout } from "../context/WorkoutContext";

import PageHeading from "../components/common/PageHeading";
import { Select } from "../components/common/Inputs";
import TabNavigation from "../components/common/TabNavigation";
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

    return (
        <div className="content">
            <PageHeading>Your Stats</PageHeading>
            <TabNavigation
                tabs={[
                    { to: "/stats", label: "Stats", end: true },
                    { to: "/stats/exercises", label: "Exercises" },
                ]}
            />
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
                    </section>
                </>
            )}
        </div>
    );
}
