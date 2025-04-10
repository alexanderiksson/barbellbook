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
        <Link to={`/history/${workout.id}`} key={workout.id}>
            <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg shadow-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-500/10 w-12 h-12 flex justify-center items-center rounded-full">
                        <GymIcon size="24px" color="#10b981" />
                    </div>

                    <h2 className="text-lg font-semibold overflow-hidden">
                        {workout.name ? workout.name : "Workout"}
                    </h2>
                </div>

                <span className="text-neutral-500 text-sm">{dateConverter(workout.date)}</span>
            </div>
        </Link>
    );
}
