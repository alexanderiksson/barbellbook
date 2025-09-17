import { useState, useEffect } from "react";
import { parseWorkoutTime, buildMonotonicTimeline } from "../utils/time";

const formatElapsedTime = (elapsedSeconds: number): string => {
    const totalMinutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    const formattedMinutes = totalMinutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
};

// Calculate elapsed time from a time string to now
const calculateElapsedTime = (timeString: string): number => {
    if (!timeString) return 0;

    const parsed = parseWorkoutTime(timeString);
    if (parsed === null) return 0;

    const now = new Date();
    const nowMsFromMidnight =
        ((now.getHours() * 60 + now.getMinutes()) * 60 + now.getSeconds()) * 1000 +
        now.getMilliseconds();
    const timeline = buildMonotonicTimeline([parsed, nowMsFromMidnight]);
    if (!timeline || timeline.length < 2) return 0;
    const diffMs = timeline[1] - timeline[0];
    return Math.floor(diffMs / 1000);
};

export const usePersistentTimer = (
    lastSetTime: string | undefined,
    timeLimitMinutes: number = 0.5
): string | null => {
    const [, setCurrentTime] = useState(Date.now());

    // Update current time every second for live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!lastSetTime) {
        return formatElapsedTime(timeLimitMinutes * 60);
    }

    const elapsedSeconds = calculateElapsedTime(lastSetTime);

    if (elapsedSeconds < 0) {
        return formatElapsedTime(timeLimitMinutes * 60);
    }

    const timeLimitSeconds = timeLimitMinutes * 60;
    const remainingSeconds = Math.max(0, timeLimitSeconds - elapsedSeconds);

    return formatElapsedTime(remainingSeconds);
};

export default function timer(timeString: string): string {
    if (!timeString) return "";

    const elapsedSeconds = calculateElapsedTime(timeString);

    if (elapsedSeconds < 0) {
        return "just now";
    }

    return formatElapsedTime(elapsedSeconds);
}
