import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkout } from "../../../context/WorkoutContext";
import { useSettings } from "../../../context/SettingsContext";
import exercisesData from "../../../data/exercises.json";
import { WorkoutType } from "../../../types/workout";
import { IoIosArrowDown } from "react-icons/io";

export default function Stats({ id }: { id: string | undefined }) {
    const { workouts } = useWorkout();
    const { weightUnit } = useSettings();

    const [isOpen, setIsOpen] = useState(false);

    const workout: WorkoutType | undefined = useMemo(() => {
        const workoutId = parseInt(id || "", 10);
        if (isNaN(workoutId)) return undefined;

        return workouts.find((_, index) => index === workoutId);
    }, [id, workouts]);

    if (!workout) return null;

    // Calculate total sets
    const totalSets = useMemo(
        () => workout.exercises.reduce((sets, exercise) => sets + exercise.sets.length, 0),
        [workout]
    );

    // Calculate total reps
    const totalReps = useMemo(
        () =>
            workout.exercises.reduce(
                (reps, exercise) =>
                    reps + exercise.sets.reduce((setReps, set) => setReps + set.reps, 0),
                0
            ),
        [workout]
    );

    // Calculate total weight
    const totalWeight = useMemo(
        () =>
            workout.exercises.reduce(
                (weight, exercise) =>
                    weight +
                    exercise.sets.reduce(
                        (setWeight, set) => setWeight + parseFloat(set.weight || "0") * set.reps,
                        0
                    ),
                0
            ),
        [workout]
    );

    // Calculate body parts trained
    const bodyPartsTrained = useMemo(() => {
        const exerciseToBodyPart: Record<string, string> = {};
        (exercisesData as Array<{ name: string; [key: string]: any }>).forEach((ex) => {
            exerciseToBodyPart[ex.name] = ex["body-part"];
        });

        const partCount: Record<string, number> = {};
        workout.exercises.forEach((ex) => {
            const part = exerciseToBodyPart[ex.name];
            if (part) {
                partCount[part] = (partCount[part] || 0) + 1;
            }
        });

        const total = Object.values(partCount).reduce((sum, n) => sum + n, 0);
        return Object.entries(partCount)
            .map(([part, count]) => ({
                part,
                percent: total > 0 ? Math.round((count / total) * 100) : 0,
            }))
            .sort((a, b) => b.percent - a.percent);
    }, [workout]);

    return (
        <div className="bg-secondary p-4 rounded-2xl border border-border/20 mt-4">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-sm text-text-grey">Workout details</h2>
                <IoIosArrowDown
                    size={20}
                    color="grey"
                    className={`transition-all ${!isOpen ? "-rotate-90" : ""}`}
                />
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="stats"
                        initial={{ maxHeight: 0 }}
                        animate={{ maxHeight: 500 }}
                        exit={{ maxHeight: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-8 mb-8">
                            <div className="flex flex-col justify-center">
                                <h3 className="text-text-grey text-sm">Total sets</h3>
                                <span>{totalSets}</span>
                            </div>
                            <div>
                                <h3 className="text-text-grey text-sm">Total reps</h3>
                                <span>{totalReps}</span>
                            </div>
                            <div>
                                <h3 className="text-text-grey text-sm">Avg. rest time</h3>
                                <span>-</span>
                            </div>
                            <div>
                                <h3 className="text-text-grey text-sm">Total weight</h3>
                                <span>
                                    {totalWeight} <span>{weightUnit}</span>
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-text-grey text-sm mb-1">Body-parts trained</h3>
                            <div className="flex flex-col divide-y divide-border/50">
                                {bodyPartsTrained.map(({ part, percent }, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center gap-4 py-1"
                                    >
                                        <h3 className="truncate">
                                            <span className="text-text-grey">{index + 1}.</span>{" "}
                                            {part}
                                        </h3>
                                        <span>{percent} %</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
