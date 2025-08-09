import { useSettings } from "../../../context/SettingsContext";
import { ExerciseType } from "../../../types/workout";

interface ExerciseCardProps {
    index: number;
    exercise: ExerciseType;
}

export default function ExerciseCard({ index, exercise }: ExerciseCardProps) {
    const { weightUnit } = useSettings();

    return (
        <div className="p-4 lg:px-6 bg-secondary border border-border/20 rounded-2xl shadow-xl">
            <h2 className="font-medium mb-4 truncate">
                <span className="mr-2 text-text-grey">#{index}</span>
                {exercise.name}
            </h2>
            <table className="w-full text-sm">
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
                            <td>
                                {set.weight} <span className="text-text-grey">{weightUnit}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
