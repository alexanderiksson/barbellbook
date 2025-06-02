import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { WorkoutType, ExerciseType, SetType } from "../types/workout";

interface WorkoutContextType {
    exercises: ExerciseType[];
    addExercise: (exercise: ExerciseType) => void;
    removeExercise: (index: number) => void;
    clearExercises: () => void;
    workouts: WorkoutType[];
    addWorkout: (workout: WorkoutType) => void;
    removeWorkout: (index: number) => void;
    updateWorkoutName: (index: number, newName: string) => void;
    saveWorkoutLog: (index: number, log: string) => void;
    clearWorkouts: () => void;
    currentSets: SetType[];
    saveCurrentSets: (set: SetType) => void;
    removeCurrentSets: (index: number) => void;
    clearCurrentSets: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
    children: ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
    // Exercises state
    const [exercises, setExercises] = useState<ExerciseType[]>(() => {
        const storedExercises = localStorage.getItem("exercises");
        return storedExercises ? JSON.parse(storedExercises) : [];
    });

    // Workouts state
    const [workouts, setWorkouts] = useState<WorkoutType[]>(() => {
        const storedWorkouts = localStorage.getItem("workouts");
        return storedWorkouts ? JSON.parse(storedWorkouts) : [];
    });

    // Current sets state
    const [currentSets, setCurrentSets] = useState<SetType[]>(() => {
        const storedSets = localStorage.getItem("currentSets");
        return storedSets ? JSON.parse(storedSets) : [];
    });

    // Function to save exercises to local storage when a new exercise is added to state
    useEffect(() => {
        localStorage.setItem("exercises", JSON.stringify(exercises));
    }, [exercises]);

    // Function to save workout to local storage when workout is saved to state
    useEffect(() => {
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }, [workouts]);

    // Function to save current sets to session storage when state is updated
    useEffect(() => {
        localStorage.setItem("currentSets", JSON.stringify(currentSets));
    }, [currentSets]);

    // Add exercise to new workout
    const addExercise = (exercise: ExerciseType): void => {
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
    const addWorkout = (workout: WorkoutType): void => {
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

    // Save workout log
    const saveWorkoutLog = (index: number, log: string): void => {
        setWorkouts((prevWorkouts) =>
            prevWorkouts.map((workout, i) => (i === index ? { ...workout, log: log } : workout))
        );
    };

    // Remove all exercises from workout
    const clearWorkouts = (): void => {
        setWorkouts([]);
        localStorage.removeItem("workouts");
    };

    // Save current set to session storage
    const saveCurrentSets = (set: SetType): void => {
        setCurrentSets((prevSets) => [...prevSets, set]);
    };

    // Remove set from session storage
    const removeCurrentSets = (index: number): void => {
        setCurrentSets((prevSets) => prevSets.filter((_, i) => i !== index));
    };

    // Remove all sets from session storage
    const clearCurrentSets = (): void => {
        setCurrentSets([]);
        localStorage.removeItem("currentSets");
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
                saveWorkoutLog,
                clearWorkouts,
                currentSets,
                saveCurrentSets,
                removeCurrentSets,
                clearCurrentSets,
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
