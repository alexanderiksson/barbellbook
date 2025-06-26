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
            <div className="px-5 py-3 bg-secondary border border-border/20 rounded-2xl shadow flex justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-accent-bright/10 min-w-12 min-h-12 flex justify-center items-center rounded-full">
                        <GymIcon
                            size="24px"
                            color={getComputedStyle(document.documentElement).getPropertyValue(
                                "--color-accent-bright"
                            )}
                        />
                    </div>

                    <h2 className="text-lg font-medium truncate">
                        {workout.name ? workout.name : "Workout"}
                    </h2>
                </div>

                <span className="text-text-grey text-xs flex items-center gap-1">
                    <IoIosCalendar size={16} />
                    {dateConverter(workout.date)}
                </span>
            </div>
        </Link>
    );
}
