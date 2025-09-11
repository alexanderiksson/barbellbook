import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { WorkoutType } from "../../../types/workout";

export default function WorkoutsPerWeekday({
    workouts,
    year,
}: {
    workouts: WorkoutType[];
    year: string;
}) {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const data = weekdays.map((day) => {
        const count = workouts
            .filter((w) => new Date(w.date).getFullYear().toString() === year)
            .reduce((acc, w) => {
                const weekday = new Date(w.date).toLocaleString("en-US", { weekday: "short" });
                return weekday === day ? acc + 1 : acc;
            }, 0);

        return { day, Sessions: count };
    });

    return (
        <div className="bg-[var(--secondary)] p-4 rounded-2xl border border-[var(--border)]/20">
            <h2 className="mb-6 text-[var(--text-grey)] text-sm">Weekly Training Pattern</h2>
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis dataKey="day" fontSize={12} />
                        <YAxis allowDecimals={false} fontSize={12} />
                        <Tooltip />
                        <Bar
                            dataKey="Sessions"
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
