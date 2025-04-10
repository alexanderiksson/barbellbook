export default function dateConverter(date: string): string {
    const workoutDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let daysSince: string;

    if (workoutDate.toLocaleDateString() === today.toLocaleDateString()) {
        daysSince = "Today";
    } else if (workoutDate.toLocaleDateString() === yesterday.toLocaleDateString()) {
        daysSince = "Yesterday";
    } else if ((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24) < 7) {
        daysSince = workoutDate.toLocaleDateString("en-US", {
            weekday: "long",
        });
    } else {
        daysSince = workoutDate.toLocaleDateString();
    }
    return daysSince;
}
