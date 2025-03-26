import React from "react";

export default function WeightInput({ weight, setWeight }) {
    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <h2 className="text-3xl font-semibold">Weight (kg)</h2>
            <input
                className="bg-neutral-800 p-2 rounded w-24 border border-white/10"
                type="number"
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
            />
        </div>
    );
}
