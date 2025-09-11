import { Link } from "react-router-dom";
import dateConverter from "../../../utils/dateConverter";
import { IoIosCalendar } from "react-icons/io";
import { WorkoutType } from "../../../types/workout";

interface WorkoutProps extends WorkoutType {
    id: number;
}

export default function WorkoutCard({ workout }: { workout: WorkoutProps }) {
    return (
        <Link to={`/history/${workout.id}`}>
            <div className="p-4 bg-[var(--secondary)] border border-[var(--border)]/20 rounded-2xl flex flex-col gap-2">
                <h2 className="font-medium truncate">{workout.name ? workout.name : "Workout"}</h2>

                <span className="text-[var(--text-grey)] text-xs flex items-center gap-1">
                    <IoIosCalendar size={14} />
                    {dateConverter(workout.date)}
                </span>
            </div>
        </Link>
    );
}
