import { useState } from "react";
import { useSettings } from "../../../context/SettingsContext";
import { SetType } from "../../../types/workout";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

interface PreviousSessionProps {
    sets: SetType[];
}

export default function PreviousSession({ sets }: PreviousSessionProps) {
    const { weightUnit } = useSettings();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="bg-secondary border border-border/20 rounded-2xl p-4 text-sm">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-text-grey text-sm">Previous session</h2>
                <IoIosArrowDown
                    size={20}
                    color="grey"
                    className={`transition-all ${!isOpen ? "-rotate-90" : ""}`}
                />
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="last-session-table"
                        initial={{ maxHeight: 0 }}
                        animate={{ maxHeight: 300 }}
                        exit={{ maxHeight: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <table className="w-full mt-4">
                            <thead>
                                <tr className="text-left">
                                    <th>Set</th>
                                    <th>Reps</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sets.map((set, index) => (
                                    <tr key={index}>
                                        <td>Set {index + 1}</td>
                                        <td>{set.reps}</td>
                                        <td>
                                            {set.weight}{" "}
                                            <span className="text-text-grey">{weightUnit}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
