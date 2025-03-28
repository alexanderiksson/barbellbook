import React, { createContext, useState, useContext, useEffect } from "react";

const WorkoutContext = createContext();

// Provide the context to children components
export function WorkoutProvider({ children }) {
    // State for exercises (saved to sessionStorage)
    const [exercises, setExercises] = useState(() => {
        const storedExercises = localStorage.getItem("exercises");
        return storedExercises ? JSON.parse(storedExercises) : [];
    });

    // State for all workouts (saved to localStorage)
    const [workouts, setWorkouts] = useState(() => {
        const storedWorkouts = localStorage.getItem("workouts");
        return storedWorkouts ? JSON.parse(storedWorkouts) : [];
    });

    // Save exercises to sessionStorage whenever they change
    useEffect(() => {
        localStorage.setItem("exercises", JSON.stringify(exercises));
    }, [exercises]);

    // Save workouts to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }, [workouts]);

    // Function to add an exercise
    const addExercise = (exercise) => {
        setExercises((prevExercises) => [...prevExercises, exercise]);
    };

    // Function to remove an exercise by index
    const removeExercise = (index) => {
        setExercises((prevExercises) =>
            prevExercises.filter((_, i) => i !== index)
        );
    };

    // Function to clear all exercises
    const clearExercises = () => {
        setExercises([]); // Clear exercises state
        localStorage.removeItem("exercises"); // Remove exercises from sessionStorage
    };

    // Function to add a workout
    const addWorkout = (workout) => {
        setWorkouts((prevWorkouts) => [...prevWorkouts, workout]);
    };

    // Function to remove a workout by index
    const removeWorkout = (index) => {
        setWorkouts((prevWorkouts) =>
            prevWorkouts.filter((_, i) => i !== index)
        );
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
