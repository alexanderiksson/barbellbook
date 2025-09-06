import { useState, useEffect, useRef } from "react";
import { useWorkout } from "../../../context/WorkoutContext";
import { Button } from "../../common/Buttons";
import Notice from "../../common/Notice";

export default function Log({ workoutId, log }: { workoutId: number; log: string | undefined }) {
    const { saveWorkoutLog } = useWorkout();
    const [textareaValue, setTextareaValue] = useState("");

    // Trigger to show notice
    const noticeTriggerRef = useRef<() => void | null>(null);

    useEffect(() => {
        if (log) {
            setTextareaValue(log);
        }
    }, [log]);

    return (
        <>
            <Notice
                msg="Log saved!"
                registerTrigger={(trigger) => (noticeTriggerRef.current = trigger)}
            />

            <textarea
                className="w-full p-4 placeholder:text-text-grey/50 bg-black/20 rounded-2xl border border-border/20 mb-4"
                rows={10}
                placeholder="Write something about your workout..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
            ></textarea>

            <Button
                variant="blue"
                className="w-full lg:w-48"
                onClick={() => {
                    if (textareaValue || (log && !textareaValue)) {
                        saveWorkoutLog(workoutId, textareaValue);

                        // Trigger the notice
                        if (noticeTriggerRef.current) {
                            noticeTriggerRef.current();
                        }
                    }
                }}
            >
                Save
            </Button>
        </>
    );
}
