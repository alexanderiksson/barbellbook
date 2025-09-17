import { useMemo } from "react";
import { useWorkout } from "../../../context/WorkoutContext";
import { useSettings } from "../../../context/SettingsContext";
import exercisesData from "../../../data/exercises.json";
import { WorkoutType } from "../../../types/workout";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

export default function Details({ id }: { id: string | undefined }) {
    const { workouts } = useWorkout();
    const { weightUnit } = useSettings();

    const workout: WorkoutType | undefined = useMemo(() => {
        const workoutId = parseInt(id || "", 10);
        if (isNaN(workoutId)) return undefined;

        return workouts.find((_, index) => index === workoutId);
    }, [id, workouts]);

    if (!workout) return null;

    // Calculate total sets
    const totalSets = useMemo(
        () => workout.exercises.reduce((sets, exercise) => sets + exercise.sets.length, 0),
        [workout]
    );

    // Calculate total reps
    const totalReps = useMemo(
        () =>
            workout.exercises.reduce(
                (reps, exercise) =>
                    reps + exercise.sets.reduce((setReps, set) => setReps + set.reps, 0),
                0
            ),
        [workout]
    );

    // Calculate total weight
    const totalWeight = useMemo(
        () =>
            workout.exercises.reduce(
                (weight, exercise) =>
                    weight +
                    exercise.sets.reduce(
                        (setWeight, set) =>
                            setWeight + parseFloat(String(set.weight ?? "0")) * set.reps,
                        0
                    ),
                0
            ),
        [workout]
    );

    // Calculate body parts trained
    const allBodyParts = [...new Set(exercisesData.map((ex) => ex["body-part"]))];

    const bodyPartsTrained = useMemo(() => {
        const bodyPartCounts = workout.exercises
            .map((ex) => exercisesData.find((e) => e.name === ex.name)?.["body-part"])
            .filter(Boolean)
            .reduce<Map<string, number>>((acc, bodyPart) => {
                acc.set(bodyPart!, (acc.get(bodyPart!) || 0) + 1);
                return acc;
            }, new Map<string, number>());

        const total = Array.from(bodyPartCounts.values()).reduce((sum, count) => sum + count, 0);

        return allBodyParts
            .map((bodyPart) => ({
                name: bodyPart,
                percentage: total
                    ? Math.round(((bodyPartCounts.get(bodyPart) || 0) / total) * 100)
                    : 0,
            }))
            .sort((a, b) => b.percentage - a.percentage);
    }, [workout]);

    // Simple, safe cross-platform time parser
    const parseTime = (value?: string): number | null => {
        if (!value) return null;

        // Try native parse first (works for ISO)
        const native = Date.parse(value);
        if (!isNaN(native)) return native;

        // Fallback: HH:MM or HH:MM:SS
        if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
            const [h, m, s = 0] = value.split(":").map(Number);
            if (h > 23 || m > 59 || s > 59) return null;
            // Represent as milliseconds-from-midnight (enough for intra-workout math)
            return ((h * 60 + m) * 60 + s) * 1000;
        }

        return null;
    };

    // Shared: normalize & sort (handles either absolute ms or ms-from-midnight)
    const prepareTimes = (times: number[]) => {
        if (times.length < 2) return null;
        // If all values look like < 2 days => treat as relative (already fine for differences)
        return times.sort((a, b) => a - b);
    };

    // Calculate average rest time
    const averageRestTime = useMemo(() => {
        const times: number[] = [];
        for (const exercise of workout.exercises) {
            for (const set of exercise.sets) {
                const t = parseTime(set.time);
                if (t !== null) times.push(t);
            }
        }
        const sorted = prepareTimes(times);
        if (!sorted) return null;

        let total = 0;
        for (let i = 1; i < sorted.length; i++) {
            total += sorted[i] - sorted[i - 1];
        }
        const avgMs = total / (sorted.length - 1);
        return Number((avgMs / 60000).toFixed(1));
    }, [workout]);

    // Calculate workout duration
    const workoutDuration = useMemo(() => {
        const times: number[] = [];
        for (const exercise of workout.exercises) {
            for (const set of exercise.sets) {
                const t = parseTime(set.time);
                if (t !== null) times.push(t);
            }
        }
        const sorted = prepareTimes(times);
        if (!sorted) return null;

        const durationMs = sorted[sorted.length - 1] - sorted[0];
        return Math.round(durationMs / 60000);
    }, [workout]);

    // Calculate average exercise duration
    const averageExerciseDuration = useMemo(() => {
        if (workoutDuration === null) return null;
        return Number((workoutDuration / workout.exercises.length).toFixed(1));
    }, [workoutDuration, workout.exercises.length]);

    return (
        <div className="bg-[var(--secondary)] p-4 rounded-[var(--radius)] border border-[var(--border)]/20">
            <div key="stats" className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <h3 className="text-[var(--text-grey)] text-sm">Duration</h3>
                        <span>{workoutDuration !== null ? `${workoutDuration} min` : "-"}</span>
                    </div>

                    <div>
                        <h3 className="text-[var(--text-grey)] text-sm">Total Sets</h3>
                        <span>{totalSets}</span>
                    </div>

                    <div>
                        <h3 className="text-[var(--text-grey)] text-sm">Total Reps</h3>
                        <span>{totalReps}</span>
                    </div>

                    <div>
                        <h3 className="text-[var(--text-grey)] text-sm">Total Weight</h3>
                        <span>
                            {totalWeight} <span>{weightUnit}</span>
                        </span>
                    </div>

                    <div>
                        <h3 className="text-[var(--text-grey)] text-sm">Avg. Rest</h3>
                        <span>{averageRestTime !== null ? `${averageRestTime} min` : "-"}</span>
                    </div>

                    <div>
                        <h3 className="text-[var(--text-grey)] text-sm">Avg. Time/Exercise</h3>
                        <span>
                            {averageExerciseDuration !== null
                                ? `${averageExerciseDuration} min`
                                : "-"}
                        </span>
                    </div>
                </div>

                <div>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={bodyPartsTrained}>
                                <PolarGrid opacity={0.5} />
                                <PolarAngleAxis dataKey="name" fontSize={12} />

                                <Radar
                                    dataKey="percentage"
                                    stroke={getComputedStyle(
                                        document.documentElement
                                    ).getPropertyValue("--primary-bright")}
                                    fill={getComputedStyle(
                                        document.documentElement
                                    ).getPropertyValue("--primary-bright")}
                                    fillOpacity={0.7}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
