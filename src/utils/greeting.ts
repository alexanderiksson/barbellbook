import { useState, useEffect } from "react";

const Greeting = () => {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const savedGreeting = sessionStorage.getItem("greeting");
        if (savedGreeting) {
            setGreeting(savedGreeting);
            return;
        }

        const currentTime = new Date().getHours();

        const greetings = {
            morning: [
                "Rise & Train 🌅💪",
                "Morning Power ☀️🔥",
                "Start Strong 💥",
                "Wake & Move 🏃‍♂️",
            ],
            day: ["Stay Strong 💪", "Midday Energy ⚡", "Keep Moving 🚀", "Push Forward 🏋️"],
            afternoon: [
                "Power Up ⚡🔥",
                "Finish Strong 🏆",
                "Afternoon Grind 🏃",
                "Energy Boost 💥",
            ],
            evening: ["Evening Power 🌙💪", "Train & Relax 🧘‍♂️", "Stay Focused 🎯", "End Strong 🏋️‍♀️"],
            night: [
                "Rest & Recover 😴",
                "Sleep Strong 🌙💤",
                "Recovery Time 🛌",
                "Dream Gains 💭💪",
            ],
        };

        let options;

        if (currentTime > 5 && currentTime <= 10) options = greetings.morning;
        else if (currentTime > 10 && currentTime <= 14) options = greetings.day;
        else if (currentTime > 14 && currentTime <= 18) options = greetings.afternoon;
        else if (currentTime > 18 && currentTime <= 22) options = greetings.evening;
        else options = greetings.night;

        const randomGreeting = options[Math.floor(Math.random() * options.length)];

        setGreeting(randomGreeting);
        sessionStorage.setItem("greeting", randomGreeting);
    }, []);

    return greeting;
};

export default Greeting;
