import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { WorkoutType } from "../../../types/workout";

export default function MonthlyExercises({
    workouts,
    year,
}: {
    workouts: WorkoutType[];
    year: string;
}) {
    const data = Array.from(
        workouts
            .filter((w) => new Date(w.date).getFullYear().toString() === year)
            .reduce((acc, w) => {
                const month = new Date(w.date).toLocaleString("en-US", { month: "short" });
                const exercises = (acc.get(month) || 0) + w.exercises.length;
                acc.set(month, exercises);
                return acc;
            }, new Map<string, number>())
    ).map(([month, Exercises]) => ({ month, Exercises }));

    return (
        <div className="bg-[var(--secondary)] p-4 rounded-[var(--radius)] border border-[var(--border)]/20">
            <h2 className="mb-6 text-[var(--text-grey)] text-sm">Monthly Exercises</h2>
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis allowDecimals={false} fontSize={12} />
                        <Tooltip />
                        <Bar
                            dataKey="Exercises"
                            fill={getComputedStyle(document.documentElement).getPropertyValue(
                                "--accent-bright"
                            )}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
