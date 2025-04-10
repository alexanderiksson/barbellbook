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
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
    children: ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
    const [exercises, setExercises] = useState<Exercise[]>(() => {
        const storedExercises = localStorage.getItem("exercises");
        return storedExercises ? JSON.parse(storedExercises) : [];
    });

    const [workouts, setWorkouts] = useState<Workout[]>(() => {
        const storedWorkouts = localStorage.getItem("workouts");
        return storedWorkouts ? JSON.parse(storedWorkouts) : [];
    });

    useEffect(() => {
        localStorage.setItem("exercises", JSON.stringify(exercises));
    }, [exercises]);

    useEffect(() => {
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }, [workouts]);

    const addExercise = (exercise: Exercise): void => {
        setExercises((prevExercises) => [...prevExercises, exercise]);
    };

    const removeExercise = (index: number): void => {
        setExercises((prevExercises) => prevExercises.filter((_, i) => i !== index));
    };

    const clearExercises = (): void => {
        setExercises([]);
        localStorage.removeItem("exercises");
    };

    const addWorkout = (workout: Workout): void => {
        setWorkouts((prevWorkouts) => [...prevWorkouts, workout]);
    };

    const removeWorkout = (index: number): void => {
        setWorkouts((prevWorkouts) => prevWorkouts.filter((_, i) => i !== index));
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
