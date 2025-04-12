import { Link } from "react-router-dom";
import dateConverter from "../../../utils/dateConverter";
import GymIcon from "../../../assets/icons/GymIcon";

interface Workout {
    id: number;
    name?: string;
    date: string;
}

export default function WorkoutCard({ workout }: { workout: Workout }) {
    return (
        <Link to={`/history/${workout.id}`}>
            <div className="px-4 py-3 bg-neutral-900 border border-white/5 rounded-xl shadow flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="bg-emerald-500/10 min-w-10 min-h-10 flex justify-center items-center rounded-full">
                        <GymIcon size="20px" color="#10b981" />
                    </div>

                    <h2 className="text-lg font-semibold truncate">
                        {workout.name ? workout.name : "Workout"}
                    </h2>
                </div>

                <span className="text-neutral-500 text-xs">{dateConverter(workout.date)}</span>
            </div>
        </Link>
    );
}
