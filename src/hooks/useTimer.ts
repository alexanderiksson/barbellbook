import { useState, useEffect, useRef } from "react";
import { parseWorkoutTime, buildMonotonicTimeline } from "../utils/time";

// PWA-compatible notification function
const sendRestTimerNotification = async (): Promise<void> => {
    // Check if notifications are supported
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return;
    }

    // Request permission if not already granted
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

    // Check if service worker is available (PWA)
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        try {
            const registration = await navigator.serviceWorker.ready;

            // Use service worker notification for PWA
            await registration.showNotification("Rest Timer Complete!", {
                body: "Time to start your next set!",
                icon: "/favicon.png",
                badge: "/favicon.png",
                tag: "rest-timer",
                requireInteraction: false,
                silent: false,
            });
        } catch (error) {
            console.error("Service Worker notification failed:", error);

            // Fallback to regular notification
            const notification = new Notification("Rest Timer Complete!", {
                body: "Time to start your next set!",
                icon: "/favicon.png",
                tag: "rest-timer",
                requireInteraction: false,
            });

            setTimeout(() => {
                notification.close();
            }, 5000);
        }
    } else {
        // Regular notification for non-PWA
        const notification = new Notification("Rest Timer Complete!", {
            body: "Time to start your next set!",
            icon: "/favicon.png",
            tag: "rest-timer",
            requireInteraction: false,
        });

        setTimeout(() => {
            notification.close();
        }, 5000);
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
    const notificationSentRef = useRef(false);

    // Update current time every second for live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Reset notification flag when lastSetTime changes
    useEffect(() => {
        notificationSentRef.current = false;
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

    // Send notification when timer reaches zero (only once per timer session)
    if (remainingSeconds === 0 && enableNotifications && !notificationSentRef.current) {
        notificationSentRef.current = true;
        sendRestTimerNotification().catch(console.error);
    }

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
