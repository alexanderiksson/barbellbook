import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { WorkoutType } from "../types/workout";

import PageHeading from "../components/common/PageHeading";
import BackButton from "../components/common/BackButton";
import StatCard from "../components/pages/WorkoutStats/StatCard";
import Error from "../components/common/Error";

export default function WorkoutStats() {
    const { id } = useParams<{ id: string }>();
    const { workouts } = useWorkout();

    const workout: WorkoutType | undefined = workouts.find(
        (_, index) => index === parseInt(id || "", 10)
    );

    if (!workout) {
        return <Error msg="Workout not found" />;
    }

    const totalSets = (): number => {
        return workout.exercises.reduce((sets, exercise) => sets + exercise.sets.length, 0);
    };

    const totalReps = (): number => {
        return workout.exercises.reduce(
            (reps, exercise) =>
                reps + exercise.sets.reduce((setReps, set) => setReps + set.reps, 0),
            0
        );
    };

    const totalWeight = (): number => {
        return workout.exercises.reduce(
            (weight, exercise) =>
                weight +
                exercise.sets.reduce(
                    (setWeight, set) => setWeight + parseFloat(set.weight) * set.reps,
                    0
                ),
            0
        );
    };

    return (
        <div className="content">
            <BackButton to={`/history/${id}`} label={workout.name ? workout.name : "Workout"} />

            <PageHeading>Workout Stats</PageHeading>

            <section className="grid grid-cols-2 gap-3">
                <StatCard label="Exercises" data={workout.exercises.length} />
                <StatCard label="Total sets" data={totalSets()} />
                <StatCard label="Total reps" data={totalReps()} />
                <StatCard label="Weight lifted" data={totalWeight()} suffix="kg" />
            </section>
        </div>
    );
}
