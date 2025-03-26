import React from "react";

export default function SetTable({ sets }) {
    return (
        <>
            <table className="w-full">
                <thead>
                    <tr>
                        <th>Set</th>
                        <th>Weight</th>
                        <th>Reps</th>
                    </tr>
                </thead>
                <tbody>
                    {sets.map((set, index) => (
                        <tr key={index}>
                            <td className="text-center">Set {index + 1}</td>
                            <td className="text-center">{set.weight} kg</td>
                            <td className="text-center">{set.reps}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
