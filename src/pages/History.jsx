import { useWorkout } from "../context/WorkoutContext";
import { Link } from "react-router-dom";
import TrashIcon from "../assets/icons/TrashIcon";

export default function History() {
    const { workouts, removeWorkout } = useWorkout();

    return (
        <div className="content">
            <h1 className="text-3xl font-semibold mb-6">History</h1>

            {workouts.length == 0 ? (
                <p className="text-neutral-500">No workouts found.</p>
            ) : (
                <section className="flex flex-col gap-4">
                    {workouts.map((workout, index) => (
                        <div
                            key={index}
                            className="p-4 bg-neutral-900 border border-white/10 rounded shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-semibold">
                                    {workout.name
                                        ? workout.name
                                        : `Workout #${index + 1}`}
                                </h2>
                                <span className="text-neutral-500 text-sm">
                                    {workout.date}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <Link
                                    to={`/history/${index + 1}`}
                                    className="bg-sky-700 px-4 py-2 rounded inline-flex justify-center items-center cursor-pointer tracking-wide"
                                >
                                    View workout
                                </Link>
                                <button
                                    className="cursor-pointer flex items-end"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                "Are you sure you want to remove workout?"
                                            )
                                        ) {
                                            removeWorkout(index);
                                        }
                                    }}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
