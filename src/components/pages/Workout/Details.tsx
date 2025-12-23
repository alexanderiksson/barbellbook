import { useMemo } from "react";
import {
    parseWorkoutTime,
    buildMonotonicTimeline,
    averageGapMinutes,
    spanMinutes,
} from "../../../utils/time";
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

    // Calculate body parts trained
    const allBodyParts = useMemo(
        () => [...new Set(exercisesData.map((ex) => ex["body-part"]))],
        []
    );

    // Calculate total sets
    const totalSets = useMemo(
        () => workout?.exercises.reduce((sets, exercise) => sets + exercise.sets.length, 0) ?? 0,
        [workout]
    );

    // Calculate total reps
    const totalReps = useMemo(
        () =>
            workout?.exercises.reduce(
                (reps, exercise) =>
                    reps + exercise.sets.reduce((setReps, set) => setReps + set.reps, 0),
                0
            ) ?? 0,
        [workout]
    );

    // Calculate total weight
    const totalWeight = useMemo(
        () =>
            workout?.exercises.reduce(
                (weight, exercise) =>
                    weight +
                    exercise.sets.reduce(
                        (setWeight, set) =>
                            setWeight + parseFloat(String(set.weight ?? "0")) * set.reps,
                        0
                    ),
                0
            ) ?? 0,
        [workout]
    );

    const bodyPartsTrained = useMemo(() => {
        if (!workout) return [];

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
    }, [workout, allBodyParts]);

    // Calculate average rest time
    const averageRestTime = useMemo(() => {
        if (!workout) return null;

        const parsed: number[] = [];
        for (const ex of workout.exercises) {
            for (const set of ex.sets) {
                const ms = parseWorkoutTime(set.time);
                if (ms !== null) parsed.push(ms);
            }
        }
        const timeline = buildMonotonicTimeline(parsed);
        return averageGapMinutes(timeline);
    }, [workout]);

    // Calculate workout duration
    const workoutDuration = useMemo(() => {
        if (!workout) return null;

        const parsed: number[] = [];
        for (const ex of workout.exercises) {
            for (const set of ex.sets) {
                const ms = parseWorkoutTime(set.time);
                if (ms !== null) parsed.push(ms);
            }
        }
        const timeline = buildMonotonicTimeline(parsed);
        return spanMinutes(timeline);
    }, [workout]);

    // Calculate average exercise duration
    const averageExerciseDuration = useMemo(() => {
        if (!workout || workoutDuration === null) return null;
        return Number((workoutDuration / workout.exercises.length).toFixed(1));
    }, [workoutDuration, workout]);

    if (!workout) return null;

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
