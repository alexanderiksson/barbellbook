import TrashIcon from "../assets/icons/TrashIcon";

export default function SetTable({ sets, removeSet }) {
    return (
        <>
            <table className="w-full">
                <thead className="border-b border-white/15 text-lg">
                    <tr>
                        <th className="py-2">Set</th>
                        <th className="py-2">Weight</th>
                        <th className="py-2">Reps</th>
                    </tr>
                </thead>
                <tbody>
                    {sets.map((set, index) => (
                        <tr key={index} className="">
                            <td className="text-center py-2">
                                Set {index + 1}
                            </td>
                            <td className="text-center py-2">
                                {set.weight} kg
                            </td>
                            <td className="text-center py-2">{set.reps}</td>
                            <td className="flex justify-center py-2">
                                <button
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                "Are you sure you want to remove set?"
                                            )
                                        ) {
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
