import { useState, useMemo, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { useSearchParams } from "react-router-dom";
import { useTabNavigation } from "../hooks/useTabNavigation";

import Header from "../components/layout/Header";
import { Select } from "../components/common/Inputs";
import TabNavigation from "../components/common/TabNavigation";
import MonthlyWorkouts from "../components/pages/Stats/MonthlyWorkouts";
import MostWorkedMuscleGroups from "../components/pages/Stats/MostWorkedMuscleGroups";
import WorkoutsPerWeekday from "../components/pages/Stats/WorkoutsPerWeekday";
import ExercisesList from "../components/pages/Stats/ExercisesList";
import PowerliftingStats from "../components/pages/Stats/PowerliftingStats";

export default function Stats() {
    const { workouts } = useWorkout();
    const [searchParams] = useSearchParams();

    // Check active tab from URL
    const tabFromUrl = searchParams.get("tab");
    const initialTab = tabFromUrl === "exercises" ? "exercises" : "stats";

    // Manage tab changes
    const validTabs = ["stats", "exercises"] as const;
    const { activeTab, setActiveTab, handleTabChange } = useTabNavigation(initialTab, validTabs);

    useEffect(() => {
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl === "exercises" || tabFromUrl === "stats") {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams, setActiveTab]);

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
            <Header title="Stats" />

            {workouts.length <= 0 ? (
                <p className="text-[var(--text-grey)]">No workouts logged yet.</p>
            ) : (
                <>
                    <TabNavigation
                        tabs={[
                            { id: "stats", label: "Stats" },
                            { id: "exercises", label: "Exercises" },
                        ]}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />

                    {activeTab === "stats" && (
                        <>
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="mb-6"
                            >
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
                                <PowerliftingStats workouts={workouts} year={selectedYear} />
                            </section>
                        </>
                    )}

                    {activeTab === "exercises" && <ExercisesList />}
                </>
            )}
        </div>
    );
}
