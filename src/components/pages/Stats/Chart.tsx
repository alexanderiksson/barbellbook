import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface ChartProps {
    data: Array<{ month: string; [key: string]: number | string }>;
}

export default function Chart({ data }: ChartProps) {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                        dataKey={
                            data[0]
                                ? Object.keys(data[0]).find((key) => key !== "month") || "Data"
                                : "Data"
                        }
                        fill="#0369a1"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
