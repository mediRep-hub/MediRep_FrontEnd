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

const pieData = [
  { name: "Planned", value: 312 },
  { name: "Executed", value: 45 },
  { name: "Doctors", value: 27 },
  { name: "Patients", value: 1650 },
];

const barData = [
  { name: "South Multan", planned: 40, executed: 30 },
  { name: "East", planned: 55, executed: 45 },
  { name: "North West", planned: 30, executed: 25 },
  { name: "Peshawar", planned: 70, executed: 60 },
  { name: "Islamabad", planned: 90, executed: 80 },
  { name: "Quetta", planned: 60, executed: 50 },
];

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

export default function PieCharts() {
  return (
    <div className="flex gap-4 w-full">
      <div className="bg-white rounded-lg w-full p-4 h-[350px] flex flex-col">
        <h2 className="text-sm font-semibold mb-3">Total Camps Overview</h2>

        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width={280} height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                dataKey="value"
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
export function Barchart() {
  return (
    <div className="bg-white rounded-lg w-full p-4">
      <h2 className="text-sm font-semibold mb-3">
        Region Wise Plan vs Actual Camps
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData} barGap={0} barCategoryGap="0%">
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" />

          <Bar dataKey="planned" fill="#0755e9" name="Planned Camps">
            <LabelList dataKey="planned" position="top" />
          </Bar>

          <Bar dataKey="executed" fill="#22C55E" name="Executed Camps">
            <LabelList dataKey="executed" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
