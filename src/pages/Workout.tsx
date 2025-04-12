import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import dateConverter from "../utils/dateConverter";

import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import BackButton from "../components/common/BackButton";

import StatsIcon from "../assets/icons/StatsIcon";
import GymIcon from "../assets/icons/GymIcon";
import TrashIcon from "../assets/icons/TrashIcon";
import MenuIcon from "../assets/icons/MenuIcon";

interface Set {
    reps: number;
    weight: number;
}

interface Exercise {
    name: string;
    sets: Set[];
}

interface Workout {
    name?: string;
    date: string;
    exercises: Exercise[];
}

export default function WorkoutPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { id } = useParams<{ id: string }>();
    const { workouts, removeWorkout, updateWorkoutName } = useWorkout();
    const workout: Workout | undefined = workouts.find(
        (_, index) => index === parseInt(id || "", 10)
    );

    if (loading) {
        return <Loader />;
    }

    if (!workout) {
        return <Error msg="Workout not found" />;
    }

    return (
        <div className="content">
            <BackButton to="/history" label="History" />

            <div className="flex justify-between items-center mb-4 gap-2">
                <div className="flex items-center justify-center gap-4 shrink overflow-hidden">
                    <div className="bg-emerald-500/10 w-16 h-16 flex justify-center items-center rounded-full flex-shrink-0">
                        <GymIcon size="32px" color="#10b981" />
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <h1 className="text-xl font-semibold truncate">
                            {workout.name ? workout.name : "Workout"}
                        </h1>
                        <p className="text-neutral-500 truncate">{dateConverter(workout.date)}</p>
                    </div>
                </div>

                <div className="flex gap-2 relative shrink-0">
                    <button
                        className="bg-neutral-800 w-11 h-11 rounded-xl inline-flex justify-center items-center cursor-pointer"
                        onClick={() => setIsOpen((isOpen) => !isOpen)}
                    >
                        <MenuIcon />
                    </button>
                    <div
                        className={`${
                            isOpen ? "block" : "hidden"
                        } absolute bg-neutral-800 rounded-xl w-52 right-0 top-12 shadow-xl overflow-hidden`}
                    >
                        <ul className="divide-y divide-neutral-700">
                            <li className="text-center">
                                <Link
                                    to={`/history/${id}/stats`}
                                    className="flex justify-center items-center gap-1 py-3"
                                >
                                    <StatsIcon size="20px" /> Stats
                                </Link>
                            </li>

                            <li
                                className="text-center py-3 cursor-pointer"
                                onClick={() => {
                                    setIsOpen(false);
                                    const newName = prompt("Enter new name");
                                    if (newName) {
                                        updateWorkoutName(Number(id), newName);
                                    }
                                }}
                            >
                                Edit name
                            </li>

                            <li
                                className="flex justify-center items-center gap-1 text-center py-3 cursor-pointer text-red-500"
                                onClick={() => {
                                    if (confirm("Are you sure you want to remove workout?")) {
                                        setLoading(true);
                                        removeWorkout(Number(id));
                                        window.location.href = "/history";
                                    }
                                }}
                            >
                                <TrashIcon size="20px" /> Delete
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <section className="flex flex-col gap-4 mt-8">
                {workout.exercises.map((exercise, index) => (
                    /* Create shared component fron ExerciseCard */
                    <div
                        key={index}
                        className="p-4 bg-neutral-900 border border-white/5 rounded-xl shadow-xl"
                    >
                        <h2 className="text-xl font-semibold mb-4 overflow-hidden">
                            <span className="mr-2 text-neutral-500">#{index + 1}</span>
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
                                {exercise.sets.map((set, setIndex) => (
                                    <tr key={setIndex}>
                                        <td>Set {setIndex + 1}</td>
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
