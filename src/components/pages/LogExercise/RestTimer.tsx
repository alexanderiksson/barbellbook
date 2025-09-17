import { useState, useEffect } from "react";
import { IoIosTimer } from "react-icons/io";
import { usePersistentTimer } from "../../../hooks/useTimer";
import { useWorkout } from "../../../context/WorkoutContext";
import { Select } from "../../common/Inputs";

export default function RestTimer() {
    const { currentSets } = useWorkout();

    const [restTime, setRestTime] = useState(sessionStorage.getItem("rest-timer") || "0.5");

    useEffect(() => {
        sessionStorage.setItem("rest-timer", restTime);
    }, [restTime]);

    const lastSetTime =
        currentSets.length > 0 ? currentSets[currentSets.length - 1].time : undefined;
    const timerDisplay = usePersistentTimer(lastSetTime, Number(restTime));

    return (
        <div className="bg-[var(--secondary)] backdrop-blur-lg border border-[var(--border)]/20 rounded-full py-2 px-4 flex justify-between">
            <div className="flex items-center gap-2">
                <IoIosTimer size={20} />
                <span className="text-lg">{timerDisplay}</span>
            </div>
            <Select onChange={(e) => setRestTime(e.target.value)} value={restTime} className="w-28">
                <option value="0.5">30 sec</option>
                <option value="1">1 min</option>
                <option value="2">2 min</option>
                <option value="3">3 min</option>
                <option value="4">4 min</option>
                <option value="5">5 min</option>
            </Select>
        </div>
    );
}
