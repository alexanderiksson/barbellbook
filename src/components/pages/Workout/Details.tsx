import { useMemo } from "react";
import { useWorkout } from "../../../context/WorkoutContext";
import { useSettings } from "../../../context/SettingsContext";
import exercisesData from "../../../data/exercises.json";
import { WorkoutType } from "../../../types/workout";

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
    const bodyPartsTrained = useMemo(() => {
        const exerciseToBodyPart: Record<string, string> = {};
        (exercisesData as Array<{ name: string; [key: string]: any }>).forEach((ex) => {
            exerciseToBodyPart[ex.name] = ex["body-part"];
        });

        const partCount: Record<string, number> = {};
        workout.exercises.forEach((ex) => {
            const part = exerciseToBodyPart[ex.name];
            if (part) {
                partCount[part] = (partCount[part] || 0) + 1;
            }
        });

        const total = Object.values(partCount).reduce((sum, n) => sum + n, 0);
        return Object.entries(partCount)
            .map(([part, count]) => ({
                part,
                percent: total > 0 ? Math.round((count / total) * 100) : 0,
            }))
            .sort((a, b) => b.percent - a.percent);
    }, [workout]);

    // Calculate average rest time
    const averageRestTime = useMemo(() => {
        const setTimes: number[] = [];
        for (const exercise of workout.exercises) {
            for (const set of exercise.sets) {
                if (!set.time) {
                    return null;
                }
                let t = Date.parse(set.time);
                if (isNaN(t)) {
                    const parts = set.time.split(":");
                    if (parts.length === 3) {
                        const now = new Date();
                        now.setHours(Number(parts[0]), Number(parts[1]), Number(parts[2]), 0);
                        t = now.getTime();
                    } else {
                        return null;
                    }
                }
                setTimes.push(t);
            }
        }
        setTimes.sort((a, b) => a - b);
        if (setTimes.length < 2) return null;
        let totalRest = 0;
        for (let i = 1; i < setTimes.length; i++) {
            totalRest += setTimes[i] - setTimes[i - 1];
        }
        const avgRestMs = totalRest / (setTimes.length - 1);
        const minutes = avgRestMs / 60000;
        return minutes.toFixed(1);
    }, [workout]);

    // Calculate workout duration
    const workoutDuration = useMemo(() => {
        const setTimes: number[] = [];
        for (const exercise of workout.exercises) {
            for (const set of exercise.sets) {
                if (!set.time) {
                    return null;
                }
                let t = Date.parse(set.time);
                if (isNaN(t)) {
                    const parts = set.time.split(":");
                    if (parts.length === 3) {
                        const now = new Date();
                        now.setHours(Number(parts[0]), Number(parts[1]), Number(parts[2]), 0);
                        t = now.getTime();
                    } else {
                        return null;
                    }
                }
                setTimes.push(t);
            }
        }
        if (setTimes.length < 2) return null;
        setTimes.sort((a, b) => a - b);
        const durationMs = setTimes[setTimes.length - 1] - setTimes[0];
        const minutes = Math.round(durationMs / 60000);
        return minutes;
    }, [workout]);

    // Calculate average exercise duration
    const averageExerciseDuration = useMemo(() => {
        if (!workoutDuration) return null;

        const averageDuration = workoutDuration / workout.exercises.length;
        return averageDuration.toFixed(1);
    }, [workout]);

    return (
        <div className="bg-secondary p-4 rounded-2xl border border-border/20">
            <div key="stats" className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <h3 className="text-text-grey text-sm">Duration</h3>
                        <span>{workoutDuration ? `${workoutDuration} min` : "-"}</span>
                    </div>

                    <div>
                        <h3 className="text-text-grey text-sm">Total Sets</h3>
                        <span>{totalSets}</span>
                    </div>

                    <div>
                        <h3 className="text-text-grey text-sm">Total Reps</h3>
                        <span>{totalReps}</span>
                    </div>

                    <div>
                        <h3 className="text-text-grey text-sm">Total Weight</h3>
                        <span>
                            {totalWeight} <span>{weightUnit}</span>
                        </span>
                    </div>

                    <div>
                        <h3 className="text-text-grey text-sm">Avg. Rest</h3>
                        <span>{averageRestTime ? `${averageRestTime} min` : "-"}</span>
                    </div>

                    <div>
                        <h3 className="text-text-grey text-sm">Avg. Time/Exercise</h3>
                        <span>
                            {averageExerciseDuration ? `${averageExerciseDuration} min` : "-"}
                        </span>
                    </div>
                </div>

                <div>
                    <h3 className="text-text-grey text-sm mb-1">Muslce Groups Worked</h3>
                    <div className="flex flex-col divide-y divide-border/50">
                        {bodyPartsTrained.map(({ part, percent }, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center gap-4 py-1"
                            >
                                <h3 className="truncate">
                                    <span className="text-text-grey">{index + 1}.</span> {part}
                                </h3>
                                <span>{percent} %</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
