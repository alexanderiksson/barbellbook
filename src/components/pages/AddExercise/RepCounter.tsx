import { IoMdAdd, IoMdRemove } from "react-icons/io";

interface RepCounterProps {
    reps: number;
    setReps: (value: number) => void;
}

export default function RepCounter({ reps, setReps }: RepCounterProps) {
    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <h2 className="font-semibold">Reps</h2>

            <div className="flex items-center justify-center gap-4 w-full">
                <button
                    className="flex justify-center items-center text-3xl w-12 h-12 bg-zinc-800 rounded-full cursor-pointer border border-white/5"
                    onClick={() => setReps(reps + 1)}
                    disabled={reps >= 99}
                >
                    <IoMdAdd size={20} />
                </button>
                <span className="text-3xl min-w-6 text-center">{reps}</span>
                <button
                    className="flex justify-center items-center text-3xl w-12 h-12 bg-zinc-800 rounded-full cursor-pointer border border-white/5"
                    onClick={() => setReps(reps - 1)}
                    disabled={reps <= 0}
                >
                    <IoMdRemove size={18} />
                </button>
            </div>
        </div>
    );
}
