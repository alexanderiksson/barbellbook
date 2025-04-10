import { useWorkout } from "../context/WorkoutContext";
import TrashIcon from "../assets/icons/TrashIcon";
import AddIcon from "../assets/icons/AddIcon";
import DoneIcon from "../assets/icons/DoneIcon";
import { LinkButton, Button } from "../components/common/Buttons";

// Define types for Exercise and Set
interface Set {
    reps: number;
    weight: number;
}

interface Exercise {
    name: string;
    sets: Set[];
}

export default function Workout() {
    const { exercises, removeExercise, clearExercises, addWorkout } = useWorkout() as {
        exercises: Exercise[];
        removeExercise: (index: number) => void;
        clearExercises: () => void;
        addWorkout: (workout: { name?: string; date: string; exercises: Exercise[] }) => void;
    };

    return (
        <>
            <div className="content">
                <h1 className="text-3xl font-semibold mb-6">Today's Workout</h1>
                <div className="flex justify-between flex-wrap gap-2 mb-12">
                    <LinkButton to="/add-exercise" variant={"blue"}>
                        <AddIcon size="18px" /> Add exercise
                    </LinkButton>

                    {exercises.length > 0 && (
                        <Button
                            variant={"green"}
                            onClick={() => {
                                if (confirm("Do you want to finish & save workout?")) {
                                    const name = prompt("Workout name (optional)");
                                    const date = new Date().toLocaleDateString();

                                    const newWorkout = {
                                        name: name || undefined,
                                        date: date,
                                        exercises: [...exercises],
                                    };

                                    addWorkout(newWorkout);
                                    clearExercises();
                                }
                            }}
                        >
                            <DoneIcon />
                            Finish workout
                        </Button>
                    )}
                </div>

                {exercises.length === 0 ? (
                    <p className="text-neutral-500">Get started by adding an exercise.</p>
                ) : (
                    <>
                        <section className="flex flex-col gap-4">
                            {exercises.map((exercise, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-neutral-900 border border-white/5 rounded-lg shadow-xl"
                                >
                                    <h2 className="text-xl font-semibold mb-4">
                                        <span className="mr-2 text-neutral-500">#{index + 1}</span>
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
                                            {exercise.sets.map((set, setIndex) => (
                                                <tr key={setIndex}>
                                                    <td>Set {setIndex + 1}</td>
                                                    <td>{set.reps}</td>
                                                    <td>{set.weight} kg</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <button
                                        className="cursor-pointer py-2"
                                        onClick={() => {
                                            if (
                                                confirm("Are you sure you want to remove exercise?")
                                            ) {
                                                removeExercise(index);
                                            }
                                        }}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                        </section>
                    </>
                )}
            </div>
        </>
    );
}
