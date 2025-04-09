import { useState } from "react";
import { Link } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { useParams } from "react-router-dom";
import dateConverter from "../utils/dateConverter";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";
import StatsIcon from "../assets/icons/StatsIcon";
import ArrowIcon from "../assets/icons/ArrowIcon";
import GymIcon from "../assets/icons/GymIcon";
import TrashIcon from "../assets/icons/TrashIcon";
import MenuIcon from "../assets/icons/MenuIcon";
import EditIcon from "../assets/icons/EditIcon";

export default function Workout() {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const { id } = useParams();
    const { workouts, removeWorkout } = useWorkout();
    const workout = workouts.find((_, index) => index === parseInt(id, 10));

    if (loading) {
        return <Loader />;
    }

    if (!workout) {
        return <Error />;
    }

    return (
        <div className="content">
            <Link className="mb-4 inline-flex items-center py-2 text-sky-500" to="/history">
                <ArrowIcon color="#0ea5e9" size="32px" />
                History
            </Link>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center justify-center gap-4">
                    <div className="bg-emerald-500/10 w-16 h-16 flex justify-center items-center rounded-full">
                        <GymIcon size="32px" color="#10b981" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-semibold">
                            {workout.name ? workout.name : "Workout"}
                        </h1>
                        <p className="text-neutral-500">{dateConverter(workout.date)}</p>
                    </div>
                </div>

                <div className="flex gap-2 relative">
                    <button
                        className="bg-neutral-800 w-10 h-10 rounded-lg inline-flex justify-center items-center cursor-pointer"
                        onClick={() => setIsOpen((isOpen) => !isOpen)}
                    >
                        <MenuIcon />
                    </button>
                    <div
                        className={`${
                            isOpen ? "block" : "hidden"
                        } absolute bg-neutral-800 rounded-lg w-52 right-0 top-11 shadow-xl overflow-hidden`}
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
                            {/* <li className="flex justify-center items-center gap-1 text-center py-2 cursor-pointer">
                                <EditIcon size="16px" /> Edit
                            </li> */}
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
                    <div
                        key={index}
                        className="p-4 bg-neutral-900 border border-white/5 rounded-lg shadow-xl"
                    >
                        <h2 className="text-xl font-semibold mb-4">
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
