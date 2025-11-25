import { useQuery } from "@tanstack/react-query";
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
import { productGraph } from "../../api/productServices";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
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
          <p key={index} className="text-xs text-[#7d7d7d]">
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
  console.log("🚀 ~ LineChart ~ activeIndex:", activeIndex);

  const { data: Graph } = useQuery({
    queryKey: ["productGraph"],
    queryFn: () => productGraph(),
    staleTime: 5 * 60 * 1000,
  });

  // 🔥 Convert API into chart format
  const graphData =
    Graph?.data?.data?.map((item: any) => {
      const [year, m] = item.month.split("-");

      return {
        month: monthNames[Number(m) - 1],
        Target: item.totalTarget || 0,
        Achievement: item.totalAchievement || 0,
      };
    }) || [];

  console.log("Line Graph Data =>", graphData);

  return (
    <>
      <ResponsiveContainer width="100%" height="90%">
        <ReLineChart
          data={graphData}
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
            tickLine={false}
          />

          <YAxis
            style={{ fontSize: "14px" }}
            tickFormatter={(val: number) =>
              val === 0 ? "0" : `${Math.round(val / 1000)}k`
            }
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={false} />

          {/* Green background area → Target */}
          <Area
            type="monotone"
            dataKey="Target"
            stroke="none"
            fill="rgba(34, 197, 94, 0.2)"
          />

          {/* Blue background area → Achievement */}
          <Area
            type="monotone"
            dataKey="Achievement"
            stroke="none"
            fill="rgba(59, 130, 246, 0.2)"
          />

          {/* Blue Target Line */}
          <Line
            type="monotone"
            dataKey="Target"
            stroke="#0755E9"
            strokeWidth={2}
            dot={false}
          />

          {/* Green Achievement Line */}
          <Line
            type="monotone"
            dataKey="Achievement"
            stroke="#14CCC2"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
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
