export function parseWorkoutTime(value?: string): number | null {
    if (!value) return null;

    if (value.includes("T")) {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
            return (
                (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) * 1000 +
                d.getMilliseconds()
            );
        }
    }

    const m = value.trim().match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?(?:\s?(AM|PM))?$/i);
    if (!m) return null;

    let hour = parseInt(m[1], 10);
    const minute = parseInt(m[2], 10);
    const second = m[3] ? parseInt(m[3], 10) : 0;
    const ampm = m[4]?.toUpperCase();

    if (ampm) {
        if (hour === 12 && ampm === "AM") hour = 0;
        else if (hour < 12 && ampm === "PM") hour += 12;
    }
    if (hour > 23) return null;

    return ((hour * 60 + minute) * 60 + second) * 1000;
}

export function buildMonotonicTimeline(values: number[]): number[] | null {
    if (values.length < 2) return null;
    const timeline: number[] = [];
    let dayOffset = 0;
    let prev = values[0];

    values.forEach((v, idx) => {
        if (idx > 0 && v < prev) {
            dayOffset += 24 * 60 * 60 * 1000;
        }
        timeline.push(v + dayOffset);
        prev = v;
    });
    return timeline;
}

export function averageGapMinutes(timeline: number[] | null): number | null {
    if (!timeline || timeline.length < 2) return null;
    let total = 0;
    for (let i = 1; i < timeline.length; i++) total += timeline[i] - timeline[i - 1];
    const avgMs = total / (timeline.length - 1);
    return Number((avgMs / 60000).toFixed(1));
}

export function spanMinutes(timeline: number[] | null): number | null {
    if (!timeline || timeline.length < 2) return null;
    return Math.round((timeline[timeline.length - 1] - timeline[0]) / 60000);
}
