import { useState, useEffect, useRef } from "react";
import { parseWorkoutTime, buildMonotonicTimeline } from "../utils/time";

// Schedule a background notification with the service worker
const scheduleBackgroundNotification = async (delayMs: number): Promise<void> => {
    if (!("serviceWorker" in navigator)) {
        console.log("Service worker not supported");
        return;
    }

    // Request notification permission first
    if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.log("Notification permission denied");
            return;
        }
    }

    if (Notification.permission !== "granted") {
        console.log("Notification permission not granted");
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        // Send message to service worker to schedule notification
        if (registration.active) {
            registration.active.postMessage({
                type: "SCHEDULE_NOTIFICATION",
                delay: delayMs,
                notification: {
                    title: "Rest Timer Complete!",
                    body: "Time to start your next set!",
                    icon: "/favicon.png",
                    badge: "/favicon.png",
                    tag: "rest-timer",
                },
            });
            console.log(`Scheduled background notification in ${delayMs}ms`);
        }
    } catch (error) {
        console.error("Failed to schedule background notification:", error);
    }
};

// Cancel any pending background notifications
const cancelBackgroundNotification = async (): Promise<void> => {
    if (!("serviceWorker" in navigator)) return;

    try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.active) {
            registration.active.postMessage({
                type: "CANCEL_NOTIFICATION",
            });
            console.log("Cancelled background notification");
        }
    } catch (error) {
        console.error("Failed to cancel background notification:", error);
    }
};

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
    timeLimitMinutes: number = 0.5,
    enableNotifications: boolean = true
): string | null => {
    const [, setCurrentTime] = useState(Date.now());
    const notificationScheduledRef = useRef(false);

    // Update current time every second for live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Schedule background notification when timer starts
    useEffect(() => {
        if (lastSetTime && enableNotifications && !notificationScheduledRef.current) {
            const elapsedSeconds = calculateElapsedTime(lastSetTime);
            const timeLimitSeconds = timeLimitMinutes * 60;
            const remainingSeconds = Math.max(0, timeLimitSeconds - elapsedSeconds);

            if (remainingSeconds > 0) {
                // Schedule notification for remaining time
                scheduleBackgroundNotification(remainingSeconds * 1000);
                notificationScheduledRef.current = true;
                console.log(`Timer: Scheduled notification in ${remainingSeconds} seconds`);
            }
        }
    }, [lastSetTime, timeLimitMinutes, enableNotifications]);

    // Cancel notification when component unmounts or timer changes
    useEffect(() => {
        return () => {
            if (notificationScheduledRef.current) {
                cancelBackgroundNotification();
            }
        };
    }, []);

    // Reset notification flag when lastSetTime changes
    useEffect(() => {
        if (notificationScheduledRef.current) {
            cancelBackgroundNotification();
        }
        notificationScheduledRef.current = false;
    }, [lastSetTime]);

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
