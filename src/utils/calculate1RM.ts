export default function calculate1RM(weight: number, reps: number) {
    if (reps === 1) {
        // Direct 1RM
        return weight;
    } else if (reps >= 2 && reps <= 10) {
        // Epley formula
        return weight * (1 + reps / 30);
    } else if (reps > 10 && reps <= 20) {
        // Lombardi formula
        return weight * Math.pow(reps, 0.1);
    } else {
        // Brzycki formula
        return weight * (36 / (37 - reps));
    }
}
