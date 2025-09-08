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
            <div className="p-4 bg-secondary border border-border/20 rounded-2xl shadow flex flex-col gap-2">
                <h2 className="font-medium truncate">{workout.name ? workout.name : "Workout"}</h2>

                <span className="text-text-grey text-xs flex items-center gap-1">
                    <IoIosCalendar size={14} />
                    {dateConverter(workout.date)}
                </span>
            </div>
        </Link>
    );
}
