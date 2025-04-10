import TrashIcon from "../../../assets/icons/TrashIcon";

interface Exercise {
    name: string;
    sets: { reps: number; weight: number }[];
}

export default function ExerciseCard({
    exercise,
    index,
    removeExercise,
}: {
    exercise: Exercise;
    index: number;
    removeExercise: (index: number) => void;
}) {
    return (
        <div className="p-4 bg-neutral-900 border border-white/5 rounded-lg shadow-xl">
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
                    if (confirm("Are you sure you want to remove exercise?")) {
                        removeExercise(index);
                    }
                }}
            >
                <TrashIcon />
            </button>
        </div>
    );
}
