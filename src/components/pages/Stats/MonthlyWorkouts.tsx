import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { WorkoutType } from "../../../types/workout";

export default function MonthlyWorkouts({
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
                const entry = acc.get(month) || { month, Sessions: 0, Exercises: 0 };

                entry.Sessions += 1;
                entry.Exercises += w.exercises.length;

                acc.set(month, entry);
                return acc;
            }, new Map<string, { month: string; Sessions: number; Exercises: number }>())
    ).map(([_, value]) => value);

    return (
        <div className="bg-[var(--secondary)] p-4 rounded-[var(--radius)] border border-[var(--border)]/20">
            <h2 className="mb-6 text-[var(--text-grey)] text-sm">Monthly Workouts</h2>
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis allowDecimals={false} fontSize={12} />
                        <Tooltip />
                        <Bar
                            dataKey="Sessions"
                            fill={getComputedStyle(document.documentElement).getPropertyValue(
                                "--primary-bright"
                            )}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
