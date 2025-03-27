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
                            className="p-4 bg-neutral-900 border border-white/10 rounded"
                        >
                            <div className="flex justify-between mb-8">
                                <h2 className="text-xl font-semibold">
                                    Workout #{index + 1}
                                </h2>
                                <span className="text-neutral-500">
                                    {workout.date}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <Link
                                    to={`/history/${index + 1}`}
                                    className="bg-slate-600 px-4 py-2 rounded inline-flex justify-center items-center cursor-pointer"
                                >
                                    View workout
                                </Link>
                                <button
                                    className="bg-red-600 p-2 rounded cursor-pointer"
                                    onClick={() => {
                                        if (confirm("Are you sure?")) {
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
