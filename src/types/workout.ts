export interface SetType {
    reps: number;
    weight: string;
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
