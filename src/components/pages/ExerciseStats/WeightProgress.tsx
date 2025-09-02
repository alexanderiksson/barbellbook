import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useSettings } from "../../../context/SettingsContext";
import { WorkoutType } from "../../../types/workout";

interface WeightProgressProps {
    workouts: WorkoutType[];
}

export default function WeightProgress({ workouts }: WeightProgressProps) {
    const { weightUnit } = useSettings();
    const data = workouts
        .map((workout) => {
            const exerciseData = workout.exercises[0];
            if (!exerciseData) {
                return {
                    date: new Date(workout.date).toLocaleDateString(),
                    Weight: 0,
                    Reps: 0,
                };
            }

            const maxWeight = Math.max(...exerciseData.sets.map((set) => Number(set.weight)));

            const maxWeightSets = exerciseData.sets.filter(
                (set) => Number(set.weight) === maxWeight
            );
            const maxRepsAtMaxWeight = Math.max(...maxWeightSets.map((set) => Number(set.reps)));

            return {
                date: new Date(workout.date).toLocaleDateString(),
                Weight: maxWeight,
                Reps: maxRepsAtMaxWeight,
            };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="bg-secondary p-4 rounded-2xl border border-border/20">
            <h2 className="text-text-grey text-sm mb-6">Weight Progress</h2>
            <div className="w-full h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 0,
                            right: -42,
                            left: -25,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis dataKey="date" fontSize={12} />
                        <YAxis
                            yAxisId="left"
                            fontSize={12}
                            domain={["dataMin - 1", "dataMax + 1"]}
                            allowDecimals={false}
                        />
                        <YAxis
                            yAxisId="right"
                            fontSize={12}
                            orientation="right"
                            domain={["dataMin - 1", "dataMax + 1"]}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: getComputedStyle(
                                    document.documentElement
                                ).getPropertyValue("--color-background"),
                                borderRadius: "16px",
                                border: "none",
                                color: "lightgray",
                            }}
                            formatter={(value, name) => {
                                if (name === "Weight") {
                                    return `${value} ${weightUnit}`;
                                }
                                return value;
                            }}
                        />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="bump"
                            dataKey="Weight"
                            stroke={getComputedStyle(document.documentElement).getPropertyValue(
                                "--color-primary-bright"
                            )}
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                        />
                        <Line
                            yAxisId="right"
                            type="stepAfter"
                            dataKey="Reps"
                            stroke={getComputedStyle(document.documentElement).getPropertyValue(
                                "--color-accent-bright"
                            )}
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
