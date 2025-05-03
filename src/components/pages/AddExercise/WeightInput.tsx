interface WeightInputProps {
    weight: string;
    setWeight: (value: string) => void;
}

export default function WeightInput({ weight, setWeight }: WeightInputProps) {
    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <h2 className="font-semibold">Weight</h2>
            <input
                className="bg-neutral-800 p-2 rounded-lg w-20 border border-white/5"
                type="number"
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
                step={2.5}
                min={0}
                max={9999}
            />
        </div>
    );
}
