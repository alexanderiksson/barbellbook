export interface TrendResult {
    first: number;
    recent: number;
    isIncreasing: boolean;
    isDecreasing: boolean;
    noChange: boolean;
}

export function calculateTrend(first: number, recent: number): TrendResult {
    return {
        first,
        recent,
        isIncreasing: recent > first,
        isDecreasing: recent < first,
        noChange: recent === first,
    };
}
