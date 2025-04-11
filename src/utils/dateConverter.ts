export default function dateConverter(date: string): string {
    const workoutDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let daysSince: string = workoutDate.toLocaleDateString();

    if ((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24) < 7) {
        daysSince = workoutDate.toLocaleDateString("en-US", {
            weekday: "long",
        });
    }

    if (workoutDate.toLocaleDateString() === today.toLocaleDateString()) {
        daysSince = "Today";
    }

    if (workoutDate.toLocaleDateString() === yesterday.toLocaleDateString()) {
        daysSince = "Yesterday";
    }

    return daysSince;
}
