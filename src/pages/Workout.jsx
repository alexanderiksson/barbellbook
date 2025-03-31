import { Link } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import { useParams } from "react-router-dom";
import StatsIcon from "../assets/icons/StatsIcon";
import ArrowIcon from "../assets/icons/ArrowIcon";

export default function Workout() {
    const { id } = useParams();
    const { workouts } = useWorkout();

    const workout = workouts.find((_, index) => index === parseInt(id - 1, 10));

    return (
        <div className="content">
            <Link className="mb-4 inline-flex py-2 text-sky-500" to="/history">
                <ArrowIcon color="#0ea5e9" />
                Back
            </Link>
            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold mb-4">
                    {workout.name ? workout.name : `Workout #${id}`}
                </h1>
                <Link
                    to={`/history/${id}/stats`}
                    className="bg-neutral-800 w-10 h-10 rounded-lg inline-flex justify-center items-center cursor-pointer"
                >
                    <StatsIcon color="#10b981" />
                </Link>
            </div>
            <p className="text-neutral-500 text-sm">{workout.date}</p>
            <section className="flex flex-col gap-4 mt-8">
                {workout.exercises.map((exercise, index) => (
                    <div
                        key={index}
                        className="p-4 bg-neutral-900 border border-white/5 rounded-lg shadow-xl"
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
