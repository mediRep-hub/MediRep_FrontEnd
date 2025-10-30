import { useState } from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

const data = [
  { month: "Jan", Target: 10000, Achievement: 12000 },
  { month: "Feb", Target: 20000, Achievement: 18000 },
  { month: "Mar", Target: 15000, Achievement: 22000 },
  { month: "Apr", Target: 3000, Achievement: 2500 },
  { month: "May", Target: 25000, Achievement: 28000 },
  { month: "Jun", Target: 28000, Achievement: 30000 },
  { month: "Jul", Target: 2800, Achievement: 300 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const uniquePayload = payload.filter(
      (item: any, index: number, self: any) =>
        index === self.findIndex((t: any) => t.dataKey === item.dataKey)
    );
    const dotColors: Record<string, string> = {
      Target: "#0755E9",
      Achievement: "#14CCC2",
    };

    return (
      <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-200">
        <p className="text-sm font-semibold mb-1">{label}</p>
        {uniquePayload.map((item: any, index: number) => (
          <p key={index} className="text-xs text-gray-700">
            <span
              className="inline-block w-2 h-2 mr-1 rounded-full"
              style={{ backgroundColor: dotColors[item.dataKey] }}
            ></span>
            {item.name}: {item.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default function LineChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <ResponsiveContainer
        width="100%"
        height={200}
        style={{ outline: "none", fontFamily: "inherit" }}
      >
        <ReLineChart
          data={data}
          margin={{ top: 7, right: 0, left: 0, bottom: -3 }}
          onClick={(e: any) => {
            if (e && e.activeTooltipIndex !== undefined) {
              setActiveIndex(e.activeTooltipIndex);
            } else {
              setActiveIndex(null);
            }
          }}
        >
          <CartesianGrid vertical={false} horizontal={false} />
          <XAxis
            style={{ fontSize: "14px" }}
            dataKey="month"
            axisLine={false}
            domain={[0, "auto"]}
            tickLine={false}
          />
          <YAxis
            style={{ fontSize: "14px" }}
            tickFormatter={(val: any) => (val === 0 ? "0" : `${val / 1000}k`)}
            domain={[0, "auto"]}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={false} />

          <Area
            type="monotone"
            dataKey="Target"
            stroke="none"
            fill="rgba(34, 197, 94, 0.2)"
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="Achievement"
            stroke="none"
            fill="rgba(59, 130, 246, 0.2)"
            activeDot={false}
          />

          <Line
            type="monotone"
            dataKey="Target"
            stroke="#0755E9"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Achievement"
            stroke="#14CCC2"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
          {activeIndex !== null && (
            <Line
              type="monotone"
              dataKey="Target"
              stroke="#0755E9"
              strokeWidth={2}
              dot={false}
            />
          )}
        </ReLineChart>
      </ResponsiveContainer>
      <style>
        {`
      svg:focus {
        outline: none;
      }
    `}
      </style>
    </>
  );
}
