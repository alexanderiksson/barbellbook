import { useState, useEffect } from "react";

const Greeting = () => {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const savedGreeting = sessionStorage.getItem("greeting");
        if (savedGreeting) {
            setGreeting(savedGreeting);
            return;
        }

        const now = new Date();
        const currentHour = now.getHours();
        const month = now.getMonth();

        const getSeason = (m: number) => {
            if (m === 11 || m === 0 || m === 1) return "winter";
            if (m >= 2 && m <= 4) return "spring";
            if (m >= 5 && m <= 7) return "summer";
            return "autumn";
        };

        const season = getSeason(month) as "winter" | "spring" | "summer" | "autumn";

        const seasonalGreetings: Record<
            string,
            {
                morning: string[];
                day: string[];
                afternoon: string[];
                evening: string[];
                night: string[];
            }
        > = {
            winter: {
                morning: ["Winter Power ❄️", "Winter Arc ❄️", "Frost Forge ❄️"],
                day: ["Arctic Gains ❄️", "Winter Power ❄️", "Snowbound ❄️"],
                afternoon: ["Frost Push ❄️", "Winter Arc ❄️", "Finish Strong ❄️"],
                evening: ["Frost Recovery ❄️", "Train & Unwind ❄️", "Cozy Finish ❄️"],
                night: ["Rest & Recover ❄️", "Hibernate ❄️", "Sleep Strong ❄️"],
            },
            spring: {
                morning: ["Rise & Bloom 🌸", "Fresh Start 🌿", "Morning Bloom 🌼"],
                day: ["Spring Energy 🌸", "Stay Strong 🌿", "Keep Moving 🌼"],
                afternoon: ["Power Up 🌷", "Afternoon Bloom 🌼", "Spring Grind 🌿"],
                evening: ["Evening Calm 🌸", "Train & Relax 🌿", "Stay Focused 🌼"],
                night: ["Rest & Recover 🌙", "Sleep For Growth 🌙", "Recovery Time 🌙"],
            },
            summer: {
                morning: ["Sunrise Sweat ☀️", "Summer Rise 🌞", "Start Strong ☀️"],
                day: ["Summer Heat ☀️", "Stay Strong 🌞", "Midday Burn ☀️"],
                afternoon: ["Power Up ☀️", "Summer Grind 🌞", "Finish Strong ☀️"],
                evening: ["Evening Breeze ☀️", "Train & Chill 🌞", "Stay Focused ☀️"],
                night: ["Rest & Recover 🌙", "Cool Down 🌙", "Recovery Time 🌙"],
            },
            autumn: {
                morning: ["Rise & Grind 🍂", "Autumn Strength 🍁", "Crisp Start 🍂"],
                day: ["Autumn Momentum 🍂", "Stay Strong 🍁", "Keep Moving 🍂"],
                afternoon: ["Power Up 🍂", "Harvest Gains 🍁", "Afternoon Grind 🍂"],
                evening: ["Evening Calm 🍂", "Train & Relax 🍁", "Stay Focused 🍂"],
                night: ["Rest & Recover 🍂", "Recover & Rest 🍁", "Sleep Strong 🍂"],
            },
        };

        let timeOfDayCategory: keyof (typeof seasonalGreetings)["winter"];

        if (currentHour > 5 && currentHour <= 10) timeOfDayCategory = "morning";
        else if (currentHour > 10 && currentHour <= 14) timeOfDayCategory = "day";
        else if (currentHour > 14 && currentHour <= 18) timeOfDayCategory = "afternoon";
        else if (currentHour > 18 && currentHour <= 22) timeOfDayCategory = "evening";
        else timeOfDayCategory = "night";

        const options = seasonalGreetings[season][timeOfDayCategory];

        const randomGreeting = options[Math.floor(Math.random() * options.length)];

        setGreeting(randomGreeting);
        sessionStorage.setItem("greeting", randomGreeting);
    }, []);

    return greeting;
};

export default Greeting;
