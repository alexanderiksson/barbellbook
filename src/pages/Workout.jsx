import React from "react";
import { Link } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";

export default function Workout() {
    const { exercises, addExercise, removeExercise } = useWorkout();

    return (
        <>
            <div className="content py-8">
                <h1 className="text-3xl font-semibold mb-6">Today's workout</h1>
                <Link
                    to="/add-exercise"
                    className="bg-green-600 px-4 py-2 rounded inline-flex justify-center items-center mb-12"
                >
                    + Add exercise
                </Link>
                <section className="flex flex-col gap-4">
                    {exercises.map((exercise, index) => (
                        <div
                            key={index}
                            className="p-4 bg-neutral-900 border border-white/10 rounded"
                        >
                            <h2 className="text-xl font-bold mb-4">
                                {exercise.name}
                            </h2>
                            <table className="w-full mb-4">
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
                            <button
                                className="bg-red-600 py-1 px-2 rounded cursor-pointer"
                                onClick={() => removeExercise(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </section>
            </div>
        </>
    );
}
