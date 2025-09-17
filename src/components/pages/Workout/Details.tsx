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

    // Flexible time parser:
    // Returns milliseconds-from-midnight for all legacy formats,
    // OR ms-from-midnight for ISO too (so everything is uniform).
    const parseTime = (value?: string): number | null => {
        if (!value) return null;

        // ISO?
        if (value.includes("T")) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                return (
                    (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) * 1000 +
                    d.getMilliseconds()
                );
            }
        }

        // Match: H:MM, HH:MM, H:MM:SS, HH:MM:SS with optional AM/PM
        const m = value.trim().match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?(?:\s?(AM|PM))?$/i);
        if (!m) return null;

        let hour = parseInt(m[1], 10);
        const minute = parseInt(m[2], 10);
        const second = m[3] ? parseInt(m[3], 10) : 0;
        const ampm = m[4]?.toUpperCase();

        if (ampm) {
            if (hour === 12 && ampm === "AM") hour = 0;
            else if (hour < 12 && ampm === "PM") hour += 12;
        }
        if (hour > 23) return null;

        return ((hour * 60 + minute) * 60 + second) * 1000;
    };

    // Build a monotonic timeline from ms-from-midnight values,
    // handling potential wrap past midnight (e.g., 23:58 -> 00:03).
    const buildTimeline = (values: number[]): number[] | null => {
        if (values.length < 2) return null;
        const timeline: number[] = [];
        let dayOffset = 0;
        let prev = values[0];

        values.forEach((v, idx) => {
            // Detect wrap (time decreased compared to previous)
            if (idx > 0 && v < prev) {
                dayOffset += 24 * 60 * 60 * 1000;
            }
            timeline.push(v + dayOffset);
            prev = v;
        });
        return timeline;
    };

    // Calculate average rest time
    const averageRestTime = useMemo(() => {
        const parsed: number[] = [];
        for (const ex of workout.exercises) {
            for (const set of ex.sets) {
                const ms = parseTime(set.time);
                if (ms !== null) parsed.push(ms);
            }
        }
        const timeline = buildTimeline(parsed);
        if (!timeline) return null;

        let total = 0;
        for (let i = 1; i < timeline.length; i++) {
            total += timeline[i] - timeline[i - 1];
        }
        const avgMs = total / (timeline.length - 1);
        return Number((avgMs / 60000).toFixed(1));
    }, [workout]);

    // Calculate workout duration
    const workoutDuration = useMemo(() => {
        const parsed: number[] = [];
        for (const ex of workout.exercises) {
            for (const set of ex.sets) {
                const ms = parseTime(set.time);
                if (ms !== null) parsed.push(ms);
            }
        }
        const timeline = buildTimeline(parsed);
        if (!timeline) return null;

        const durationMs = timeline[timeline.length - 1] - timeline[0];
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
