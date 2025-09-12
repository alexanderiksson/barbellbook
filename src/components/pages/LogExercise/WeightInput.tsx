import { useSettings } from "../../../context/SettingsContext";

interface WeightInputProps {
    weight: string;
    setWeight: (value: string) => void;
}

export default function WeightInput({ weight, setWeight }: WeightInputProps) {
    const { weightUnit } = useSettings();

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <h2 className="text-sm text-[var(--text-grey)]">Weight</h2>
            <div className="relative">
                <input
                    className="bg-[var(--secondary-bright)] p-2 h-11 rounded-xl w-20 lg:w-24 border border-[var(--border)]/20 pr-7 no-spinner"
                    type="number"
                    inputMode="decimal"
                    onChange={(e) => setWeight(e.target.value)}
                    value={weight}
                    step={2.5}
                    min={0}
                    max={9999}
                />
                <span className="absolute right-2 top-2.5 text-[var(--text-grey)]">
                    {weightUnit}
                </span>
            </div>
        </div>
    );
}
