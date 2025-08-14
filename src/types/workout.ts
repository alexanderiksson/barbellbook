export interface SetType {
    reps: number;
    weight: number;
    time?: string;
}

export interface ExerciseType {
    name: string;
    sets: SetType[];
}

export interface WorkoutType {
    name?: string;
    date: string;
    exercises: ExerciseType[];
    log?: string;
}
