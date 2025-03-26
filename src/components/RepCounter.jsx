import React from "react";

export default function RepCounter({ reps, setReps }) {
    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <h2 className="text-3xl font-semibold">Reps</h2>
            <span className="text-3xl">{reps}</span>
            <div className="flex items-center justify-center gap-4 w-full">
                <button
                    className="flex justify-center text-3xl w-10 h-10 bg-neutral-800 rounded-full cursor-pointer border border-white/10"
                    onClick={() => setReps(reps + 1)}
                >
                    +
                </button>
                <button
                    className="flex justify-center text-3xl w-10 h-10 bg-neutral-800 rounded-full cursor-pointer border border-white/10"
                    onClick={() => setReps(reps - 1)}
                    disabled={reps <= 0}
                >
                    -
                </button>
            </div>
        </div>
    );
}
