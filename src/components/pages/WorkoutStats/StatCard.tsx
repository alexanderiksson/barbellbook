interface StatCardProps {
    label: string;
    data: number;
    suffix?: string;
}

export default function StatCard({ label, data, suffix }: StatCardProps) {
    return (
        <div className="p-4 bg-neutral-900 border border-white/5 rounded-xl shadow-xl flex flex-col justify-center items-center text-center">
            <h2 className="mb-2">{label}</h2>
            <span className="text-2xl py-4">
                {data}
                {suffix && <span className="ml-1 text-base text-neutral-500">{suffix}</span>}
            </span>
        </div>
    );
}
