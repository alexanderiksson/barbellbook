import { Link } from "react-router-dom";
import dateConverter from "../../../utils/dateConverter";
import GymIcon from "../../../assets/icons/GymIcon";
import { IoIosCalendar } from "react-icons/io";
import { WorkoutType } from "../../../types/workout";

interface WorkoutProps extends WorkoutType {
    id: number;
}

export default function WorkoutCard({ workout }: { workout: WorkoutProps }) {
    return (
        <Link to={`/history/${workout.id}`}>
            <div className="px-4 py-3 bg-secondary border border-border/20 rounded-2xl shadow flex justify-between gap-4">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="bg-accent-bright/10 min-w-10 min-h-10 flex justify-center items-center rounded-full">
                        <GymIcon
                            size="20px"
                            color={getComputedStyle(document.documentElement).getPropertyValue(
                                "--color-accent-bright"
                            )}
                        />
                    </div>

                    <h2 className="font-medium truncate">
                        {workout.name ? workout.name : "Workout"}
                    </h2>
                </div>

                <span className="text-text-grey text-xs flex items-center gap-1">
                    {dateConverter(workout.date)}
                    <IoIosCalendar size={14} />
                </span>
            </div>
        </Link>
    );
}
