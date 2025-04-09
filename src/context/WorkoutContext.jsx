import React, { createContext, useState, useContext, useEffect } from "react";

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
    const [exercises, setExercises] = useState(() => {
        const storedExercises = localStorage.getItem("exercises");
        return storedExercises ? JSON.parse(storedExercises) : [];
    });

    const [workouts, setWorkouts] = useState(() => {
        const storedWorkouts = localStorage.getItem("workouts");
        return storedWorkouts ? JSON.parse(storedWorkouts) : [];
    });

    useEffect(() => {
        localStorage.setItem("exercises", JSON.stringify(exercises));
    }, [exercises]);

    useEffect(() => {
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }, [workouts]);

    const addExercise = (exercise) => {
        setExercises((prevExercises) => [...prevExercises, exercise]);
    };

    const removeExercise = (index) => {
        setExercises((prevExercises) => prevExercises.filter((_, i) => i !== index));
    };

    const clearExercises = () => {
        setExercises([]); // Clear exercises state
        localStorage.removeItem("exercises"); // Remove exercises from sessionStorage
    };

    const addWorkout = (workout) => {
        setWorkouts((prevWorkouts) => [...prevWorkouts, workout]);
    };

    const removeWorkout = (index) => {
        setWorkouts((prevWorkouts) => prevWorkouts.filter((_, i) => i !== index));
    };

    return (
        <WorkoutContext.Provider
            value={{
                exercises,
                addExercise,
                removeExercise,
                clearExercises, // Expose the clearExercises function
                workouts,
                addWorkout,
                removeWorkout,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}

// Custom hook to use the WorkoutContext
export function useWorkout() {
    return useContext(WorkoutContext);
}
