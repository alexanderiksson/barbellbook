import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

interface ChartProps {
    data: Array<{ date: string; [key: string]: number | string }>;
}

export default function Chart({ data }: ChartProps) {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis
                        allowDecimals={false}
                        domain={["dataMin - 10", "dataMax + 10"]}
                        fontSize={12}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#0f0f0f",
                            borderRadius: "16px",
                            border: "none",
                            color: "lightgray",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey={
                            data[0]
                                ? Object.keys(data[0]).find((key) => key !== "date") || "Data"
                                : "Data"
                        }
                        stroke="#0369a1"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
