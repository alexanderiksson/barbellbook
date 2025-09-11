import { useSettings } from "../../../context/SettingsContext";
import { WorkoutType } from "../../../types/workout";

interface PersonalRecordsProps {
    workouts: WorkoutType[];
}

export default function PersonalRecords({ workouts }: PersonalRecordsProps) {
    const { weightUnit } = useSettings();

    const personalRecords = (data: WorkoutType[]) => {
        const bestResults: {
            [rep: number]: { weight: number; reps: number; date: string } | null;
        } = {};
        for (let rep = 1; rep <= 10; rep++) {
            let bestSet: { weight: number; reps: number; date: string } | null = null;
            data.forEach((workout) => {
                const ex = workout.exercises[0];
                if (ex) {
                    ex.sets.forEach((set) => {
                        if (Number(set.reps) === rep) {
                            const weightNum = Number(set.weight);
                            if (!bestSet || weightNum > bestSet.weight) {
                                bestSet = {
                                    weight: weightNum,
                                    reps: Number(set.reps),
                                    date: workout.date,
                                };
                            }
                        }
                    });
                }
            });
            bestResults[rep] = bestSet;
        }
        return bestResults;
    };

    return (
        <div className="bg-[var(--secondary)] p-4 rounded-2xl border border-[var(--border)]/20">
            <h2 className="text-[var(--text-grey)] text-sm mb-6">Personal Records</h2>
            <div className="flex flex-col gap-2 divide-y divide-[var(--border)]/50">
                {Object.entries(personalRecords(workouts)).map(([rep, record], index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                        <span>{rep} RM</span>
                        {record ? (
                            <>
                                <span>
                                    {record.weight}
                                    <span className="text-[var(--text-grey)] ml-1">
                                        {weightUnit}
                                    </span>
                                </span>
                                <span className="w-24">
                                    {new Date(record.date).toLocaleDateString()}
                                </span>
                            </>
                        ) : (
                            <>
                                <span>-</span>
                                <span className="text-[var(--text-grey)] w-24">Not logged</span>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
