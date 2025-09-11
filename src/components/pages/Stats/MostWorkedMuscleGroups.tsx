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
    // Find all muscle groups
    const allBodyParts = [...new Set(exercisesData.map((ex) => ex["body-part"]))];

    const bodyPartCounts = workouts
        .filter((w) => new Date(w.date).getFullYear().toString() === year)
        .flatMap((w) => w.exercises)
        .map((ex) => exercisesData.find((e) => e.name === ex.name)?.["body-part"])
        .filter(Boolean)
        .reduce<Map<string, number>>((acc, bodyPart) => {
            acc.set(bodyPart!, (acc.get(bodyPart!) || 0) + 1);
            return acc;
        }, new Map<string, number>());

    const total = Array.from(bodyPartCounts.values()).reduce((sum, count) => sum + count, 0);

    const data = allBodyParts.map((bodyPart) => ({
        name: bodyPart,
        percentage: total ? Math.round(((bodyPartCounts.get(bodyPart) || 0) / total) * 100) : 0,
    }));

    return (
        <div className="bg-[var(--secondary)] p-4 rounded-2xl border border-[var(--border)]/20">
            <h2 className="mb-6 text-[var(--text-grey)] text-sm">Most Worked Muscle Groups</h2>
            <div className="w-full h-72 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid opacity={0.7} />
                        <PolarAngleAxis dataKey="name" fontSize={12} />

                        <Radar
                            dataKey="percentage"
                            stroke={getComputedStyle(document.documentElement).getPropertyValue(
                                "--primary-bright"
                            )}
                            fill={getComputedStyle(document.documentElement).getPropertyValue(
                                "--primary-bright"
                            )}
                            fillOpacity={0.7}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
