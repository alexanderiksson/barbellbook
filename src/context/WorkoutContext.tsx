import { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface Exercise {
    name: string;
    sets: { reps: number; weight: number }[];
}

interface Workout {
    date: string;
    exercises: Exercise[];
}

interface WorkoutContextType {
    exercises: Exercise[];
    addExercise: (exercise: Exercise) => void;
    removeExercise: (index: number) => void;
    clearExercises: () => void;
    workouts: Workout[];
    addWorkout: (workout: Workout) => void;
    removeWorkout: (index: number) => void;
    updateWorkoutName: (index: number, newName: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
    children: ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
    // Exercises state
    const [exercises, setExercises] = useState<Exercise[]>(() => {
        const storedExercises = localStorage.getItem("exercises");
        return storedExercises ? JSON.parse(storedExercises) : [];
    });

    // Workouts state
    const [workouts, setWorkouts] = useState<Workout[]>(() => {
        const storedWorkouts = localStorage.getItem("workouts");
        return storedWorkouts ? JSON.parse(storedWorkouts) : [];
    });

    // Function to save exercises to local storage when a new exercise is added to state
    useEffect(() => {
        localStorage.setItem("exercises", JSON.stringify(exercises));
    }, [exercises]);

    // Function to save workout to local storage when workout is saved to state
    useEffect(() => {
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }, [workouts]);

    // Add exercise to new workout
    const addExercise = (exercise: Exercise): void => {
        setExercises((prevExercises) => [...prevExercises, exercise]);
    };

    // Remove specific exercise from workout
    const removeExercise = (index: number): void => {
        setExercises((prevExercises) => prevExercises.filter((_, i) => i !== index));
    };

    // Remove all exercises from workout
    const clearExercises = (): void => {
        setExercises([]);
        localStorage.removeItem("exercises");
    };

    // Save workout
    const addWorkout = (workout: Workout): void => {
        setWorkouts((prevWorkouts) => [...prevWorkouts, workout]);
    };

    // Delete saved workout
    const removeWorkout = (index: number): void => {
        setWorkouts((prevWorkouts) => prevWorkouts.filter((_, i) => i !== index));
    };

    // Update name of saved workout
    const updateWorkoutName = (index: number, newName: string): void => {
        setWorkouts((prevWorkouts) =>
            prevWorkouts.map((workout, i) =>
                i === index ? { ...workout, name: newName } : workout
            )
        );
    };

    return (
        <WorkoutContext.Provider
            value={{
                exercises,
                addExercise,
                removeExercise,
                clearExercises,
                workouts,
                addWorkout,
                removeWorkout,
                updateWorkoutName,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout(): WorkoutContextType {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error("useWorkout must be used within a WorkoutProvider");
    }
    return context;
}
