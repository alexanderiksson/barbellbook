import { useState, useMemo, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { useSearchParams } from "react-router-dom";

import PageHeading from "../components/common/PageHeading";
import { Select } from "../components/common/Inputs";
import TabNavigation from "../components/common/TabNavigation";
import MonthlyWorkouts from "../components/pages/Stats/MonthlyWorkouts";
import MostWorkedMuscleGroups from "../components/pages/Stats/MostWorkedMuscleGroups";
import WorkoutsPerWeekday from "../components/pages/Stats/WorkoutsPerWeekday";
import ExercisesList from "../components/pages/Stats/ExercisesList";

export default function Stats() {
    const { workouts } = useWorkout();
    const [searchParams] = useSearchParams();

    // Check active tab
    const tabFromUrl = searchParams.get("tab");
    const initialTab = tabFromUrl === "exercises" ? "exercises" : "stats";
    const [activeTab, setActiveTab] = useState<"stats" | "exercises">(initialTab);

    useEffect(() => {
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl === "exercises" || tabFromUrl === "stats") {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams]);

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

    // Handle tab change
    const handleTabChange = (tabId: string) => {
        if (tabId === "stats" || tabId === "exercises") {
            setActiveTab(tabId);
        }
    };

    return (
        <div className="content">
            <PageHeading>Stats</PageHeading>
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
                    {workouts.length <= 0 ? (
                        <p className="text-neutral-500">No workouts found.</p>
                    ) : (
                        <>
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
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
                            </section>
                        </>
                    )}
                </>
            )}

            {activeTab === "exercises" && <ExercisesList />}
        </div>
    );
}
