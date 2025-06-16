import { Link } from "react-router-dom";
import { ExerciseType } from "../../../types/workout";

interface ExerciseCardProps {
    index: number;
    exercise: ExerciseType;
}

export default function ExerciseCard({ index, exercise }: ExerciseCardProps) {
    return (
        <div className="p-4 bg-zinc-900 border border-white/3 rounded-2xl shadow-xl">
            <h2 className="text-lg font-medium mb-6 truncate">
                <span className="mr-2 text-neutral-500">#{index}</span>
                <Link to={`/stats/${exercise.name}`}>{exercise.name}</Link>
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
    );
}
