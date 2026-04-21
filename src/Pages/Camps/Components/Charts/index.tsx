import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

export default function PieCharts({ pieData, total }: any) {
  const [is2xl, setIs2xl] = useState(false);

  useEffect(() => {
    const check = () => setIs2xl(window.innerWidth >= 1536);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const getFontSize = (value: number) => {
    const len = String(value || 0).length;

    if (len === 1) return "text-7xl leading-none";
    if (len === 2) return "text-6xl leading-tight";
    if (len === 3) return "text-4xl leading-tight";
    return "text-4xl";
  };
  return (
    <div className="flex gap-4 w-full relative">
      <div className="bg-white rounded-lg w-full p-4 h-[320px] flex flex-col">
        <h2 className="text-sm font-medium mb-3">Total Camps Overview</h2>

        <div className="flex-1 flex items-center w-full justify-center">
          {" "}
          <div className="absolute top-[140px] flex flex-col  items-center justify-center">
            <p className={`font-bold text-[#0755e9] ${getFontSize(total)}`}>
              {total || 0}
            </p>
            <p className="text-xs text-gray-500">Total Camp</p>
          </div>
          <div className="w-[280px] 2xl:w-[330px]">
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="55%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label
                >
                  {pieData.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  layout="horizontal"
                  align="center"
                  height={30}
                  iconType="circle"
                  iconSize={is2xl ? 9 : 4}
                  formatter={(value) => {
                    return (
                      <span
                        style={{
                          fontSize: is2xl ? 14 : 9,
                          fontWeight: 400,
                        }}
                      >
                        {value}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
const RoundedBackground = (props: any) => {
  const { x, y, width, height } = props;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="#E5E7EB"
      rx={6}
      ry={6}
    />
  );
};
export function Barchart({ data }: any) {
  return (
    <div className="bg-white rounded-lg w-full p-4">
      <h2 className="text-sm font-medium mb-3">Brick Wise Camp Analysis</h2>

      <ResponsiveContainer width="100%" height={230}>
        <BarChart
          data={data}
          barGap={4}
          barCategoryGap="20%"
          margin={{ top: 18, right: 0, left: -25, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            fontSize={14}
          />
          <YAxis axisLine={false} tickLine={false} fontSize={14} />
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            align="center"
            formatter={(value) => (
              <span style={{ fontSize: 14, fontWeight: 400 }}>{value}</span>
            )}
          />
          <Bar
            dataKey="executed"
            name="Executed"
            fill="#22C55E"
            barSize={16}
            radius={[8, 8, 8, 8]}
            background={<RoundedBackground />}
          >
            <LabelList dataKey="executed" position="top" />
          </Bar>{" "}
          <Bar
            dataKey="approved"
            name="Approved"
            fill="#4F46E5"
            barSize={16}
            radius={[8, 8, 8, 8]}
            background={<RoundedBackground />}
          >
            <LabelList dataKey="approved" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
