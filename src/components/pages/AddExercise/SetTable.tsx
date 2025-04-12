import TrashIcon from "../../../assets/icons/TrashIcon";

interface Set {
    reps: number;
    weight: number;
}

interface SetTableProps {
    sets: Set[];
    removeSet: (index: number) => void;
}

export default function SetTable({ sets, removeSet }: SetTableProps) {
    return (
        <>
            <table className="w-full">
                <thead className="border-b border-white/15">
                    <tr>
                        <th className="py-2">Set</th>
                        <th className="py-2">Weight</th>
                        <th className="py-2">Reps</th>
                    </tr>
                </thead>
                <tbody>
                    {sets.map((set, index) => (
                        <tr key={index} className="text-center">
                            <td>Set {index + 1}</td>
                            <td>{set.weight} kg</td>
                            <td>{set.reps}</td>
                            <td className="flex justify-center">
                                <button
                                    className="cursor-pointer p-2"
                                    onClick={() => {
                                        if (confirm("Are you sure you want to remove set?")) {
                                            removeSet(index);
                                        }
                                    }}
                                >
                                    <TrashIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
