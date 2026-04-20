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
  return (
    <div className="flex gap-4 w-full relative">
      <div className="bg-white rounded-lg w-full p-4 h-[350px] flex flex-col">
        <h2 className="text-sm font-semibold mb-3">Total Camps Overview</h2>

        <div className="flex-1 flex items-center justify-center">
          {" "}
          <div className="absolute top-[135px] flex flex-col  items-center justify-center">
            <p className="text-6xl font-bold text-[#0755e9]">{total || 0}</p>
            <p className="text-sm text-gray-500">Total Camp</p>
          </div>
          <ResponsiveContainer width={260} height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                label
              >
                {pieData.map((_: any, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend verticalAlign="bottom" height={30} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
export function Barchart({ data }: any) {
  return (
    <div className="bg-white rounded-lg w-full p-4">
      <h2 className="text-sm font-semibold mb-3">
        Region Wise Plan vs Actual Camps
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={0} barCategoryGap="10%">
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
