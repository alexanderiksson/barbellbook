import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { useSettings } from "../context/SettingsContext";
import { WorkoutType } from "../types/workout";

import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import StatCard from "../components/pages/WorkoutStats/StatCard";
import Error from "../components/common/Error";
import exercisesData from "../data/exercises.json";

export default function WorkoutStats() {
    const { id } = useParams<{ id: string }>();
    const { workouts } = useWorkout();
    const { weightUnit } = useSettings();

    const workout: WorkoutType | undefined = useMemo(() => {
        const workoutId = parseInt(id || "", 10);
        if (isNaN(workoutId)) return undefined;

        return workouts.find((_, index) => index === workoutId);
    }, [id, workouts]);

    if (!workout) {
        return <Error msg="Workout not found" />;
    }

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
                        (setWeight, set) => setWeight + parseFloat(set.weight || "0") * set.reps,
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

    return (
        <div className="content">
            <BackButton to={`/history/${id}`} label={workout.name || "Workout"} />

            <PageHeading>Workout Stats</PageHeading>

            <div className="flex flex-col gap-4">
                <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard label="Exercises" data={workout.exercises.length} />
                    <StatCard label="Total sets" data={totalSets} />
                    <StatCard label="Total reps" data={totalReps} />
                    <StatCard label="Weight lifted" data={totalWeight} suffix={weightUnit} />
                </section>

                <section className="bg-secondary p-4 rounded-2xl border border-border/20">
                    <h2 className="mb-6 text-text-grey text-sm">Body parts trained</h2>
                    <div className="flex flex-col divide-y divide-border/50">
                        {bodyPartsTrained.map(({ part, percent }, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center gap-4 py-2"
                            >
                                <h3 className="truncate">
                                    <span className="text-text-grey mr-2">{index + 1}.</span> {part}
                                </h3>
                                <span>{percent} %</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
