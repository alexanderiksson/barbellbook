import { useState, useEffect } from "react";

// Parse time string (e.g., "2:30:45 PM" or "14:30:45") to Date object
const parseTimeString = (timeString: string): Date => {
    const today = new Date();
    const [time, period] = timeString.split(" ");
    const [hours, minutes, seconds] = time.split(":").map(Number);

    // Convert to 24-hour format if needed
    let hour24 = hours;
    if (period) {
        if (period.toLowerCase() === "pm" && hours !== 12) {
            hour24 = hours + 12;
        } else if (period.toLowerCase() === "am" && hours === 12) {
            hour24 = 0;
        }
    }

    const setTime = new Date();
    setTime.setHours(hour24, minutes, seconds, 0);

    // If the time is in the future (next day), subtract a day
    if (setTime > today) {
        setTime.setDate(setTime.getDate() - 1);
    }

    return setTime;
};

// Format elapsed time into mm:ss format
const formatElapsedTime = (elapsedSeconds: number): string => {
    const totalMinutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    // Format with leading zeros
    const formattedMinutes = totalMinutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
};

// Calculate elapsed time from a time string to now
const calculateElapsedTime = (timeString: string): number => {
    if (!timeString) return 0;

    const setTime = parseTimeString(timeString);
    const now = new Date();
    const diffMs = now.getTime() - setTime.getTime();

    return Math.floor(diffMs / 1000);
};

// Custom hook for live timer that persists across page navigation
export const usePersistentTimer = (lastSetTime: string | undefined): string | null => {
    const [, setCurrentTime] = useState(Date.now());

    // Update current time every second for live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // If no last set time, return 00:00
    if (!lastSetTime) {
        return "00:00";
    }

    // Calculate elapsed time from the actual set time
    const elapsedSeconds = calculateElapsedTime(lastSetTime);

    // Don't show negative times
    if (elapsedSeconds < 0) {
        return "just now";
    }

    return formatElapsedTime(elapsedSeconds);
};

// Static timer function (for non-live updates)
export default function timer(timeString: string): string {
    if (!timeString) return "";

    const elapsedSeconds = calculateElapsedTime(timeString);

    if (elapsedSeconds < 0) {
        return "just now";
    }

    return formatElapsedTime(elapsedSeconds);
}
