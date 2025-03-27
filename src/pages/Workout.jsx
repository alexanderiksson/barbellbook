import React from "react";
import { useWorkout } from "../context/WorkoutContext";
import { useParams } from "react-router-dom";

export default function Workout() {
    const { id } = useParams();
    const { workouts } = useWorkout();

    const workout = workouts.find((_, index) => index === parseInt(id - 1, 10));

    return (
        <div className="content">
            <h1 className="text-3xl font-semibold mb-4">
                {workout.name ? workout.name : `Workout #${id}`}
            </h1>
            <p className="text-neutral-500">{workout.date}</p>
            <section className="flex flex-col gap-4 mt-8">
                {workout.exercises.map((exercise, index) => (
                    <div
                        key={index}
                        className="p-4 bg-neutral-900 border border-white/10 rounded"
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            <span className="mr-2 font-normal text-neutral-500">
                                #{index + 1}
                            </span>
                            {exercise.name}
                        </h2>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left">
                                    <th>Set</th>
                                    <th>Reps</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercise.sets.map((set, index) => (
                                    <tr key={index}>
                                        <td>Set {index + 1}</td>
                                        <td>{set.reps}</td>
                                        <td>{set.weight} kg</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </section>
        </div>
    );
}
