import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { WorkoutType } from "../../../types/workout";
import exercisesData from "../../../data/exercises.json";

export default function MostWorkedMuscleGroups({
    workouts,
    year,
}: {
    workouts: WorkoutType[];
    year: string;
}) {
    const data = Array.from(
        workouts
            .filter((w) => new Date(w.date).getFullYear().toString() === year)
            .flatMap((w) => w.exercises)
            .map((ex) => exercisesData.find((e) => e.name === ex.name)?.["body-part"])
            .filter(Boolean)
            .reduce<Map<string, number>>((acc, bodyPart) => {
                acc.set(bodyPart!, (acc.get(bodyPart!) || 0) + 1);
                return acc;
            }, new Map<string, number>())
    ).map(([name, count], _, arr) => {
        const total = arr.reduce((sum, [, c]) => sum + c, 0);
        return {
            name,
            percentage: total ? Math.round((count / total) * 100) : 0,
        };
    });

    return (
        <div className="bg-secondary p-4 rounded-2xl border border-border/20">
            <h2 className="mb-6 text-text-grey text-sm">Most Worked Muscle Groups</h2>
            <div className="w-full h-72 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="90%" data={data}>
                        <PolarGrid opacity={0.5} />
                        <PolarAngleAxis dataKey="name" fontSize={12} />

                        <Radar
                            dataKey="percentage"
                            stroke={getComputedStyle(document.documentElement).getPropertyValue(
                                "--color-primary-bright"
                            )}
                            fill={getComputedStyle(document.documentElement).getPropertyValue(
                                "--color-primary-bright"
                            )}
                            fillOpacity={0.7}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
