import React from "react";

export default function WeightInput({ weight, setWeight }) {
    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <h2 className="font-semibold">Weight</h2>
            <input
                className="bg-neutral-800 p-2 rounded w-24 border border-white/10"
                type="number"
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
            />
        </div>
    );
}
