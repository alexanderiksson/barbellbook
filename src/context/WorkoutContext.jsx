import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const WorkoutContext = createContext();

// Provide the context to children components
export function WorkoutProvider({ children }) {
    const [exercises, setExercises] = useState(() => {
        // Load exercises from session storage on initialization
        const storedExercises = sessionStorage.getItem("exercises");
        return storedExercises ? JSON.parse(storedExercises) : [];
    });

    // Save exercises to session storage whenever they change
    useEffect(() => {
        sessionStorage.setItem("exercises", JSON.stringify(exercises));
    }, [exercises]);

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

    return (
        <WorkoutContext.Provider
            value={{ exercises, addExercise, removeExercise }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}

// Custom hook to use the WorkoutContext
export function useWorkout() {
    return useContext(WorkoutContext);
}
