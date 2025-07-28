interface StatCardProps {
    label: string;
    data: number;
    suffix?: string;
}

export default function StatCard({ label, data, suffix }: StatCardProps) {
    return (
        <div className="bg-secondary p-4 rounded-2xl border border-border/20 flex flex-col items-center text-center gap-1">
            <h2 className="text-text-grey text-sm">{label}</h2>
            <span>
                {data}
                {suffix && <span className="ml-1 text-text-grey">{suffix}</span>}
            </span>
        </div>
    );
}
