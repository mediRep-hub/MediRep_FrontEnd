import { Icon } from "@iconify/react";
import PieCharts, { Barchart } from "../Components/Charts";
const cards = [
  {
    title: "Planned Camps",
    count: 312,
    icon: "icon-park-solid:plan",
  },
  {
    title: "Executed Camps",
    count: 45,
    icon: "mdi:campfire",
  },
  {
    title: "Total Doctor",
    count: 27,
    icon: "healthicons:doctor-male",
  },
  {
    title: "Total Territories",
    count: 73,
    icon: "mdi:map-marker-radius",
  },
  {
    title: "Total Patient",
    count: 1650,
    icon: "fa6-solid:bed-pulse",
  },
  {
    title: "Total Prescriptions",
    count: 123,
    icon: "material-symbols:prescriptions",
  },
  {
    title: "Total Chemist",
    count: 22,
    icon: "mdi:flask-outline",
  },
  {
    title: "Total Products",
    count: 95,
    icon: "mdi:package-variant-closed",
  },
  {
    title: "Camps Achieved",
    count: "76%",
    icon: "mdi:chart-line",
  },
];
const employees = [
  { name: "10234 - Sheikh Bilal", points: 261 },
  { name: "10235 - Ali Ahmed", points: 240 },
  { name: "10236 - Hamza Khan", points: 198 },
  { name: "10237 - Usman Tariq", points: 175 },
  { name: "10238 - Ahsan Malik", points: 160 },
  { name: "10239 - Fahad Iqbal", points: 220 },
  { name: "10240 - Imran Khan", points: 310 },
  { name: "10241 - Hassan Raza", points: 145 },
  { name: "10242 - Saad Ali", points: 190 },
  { name: "10243 - Abdul Rehman", points: 275 },
];
export default function CampDashboard() {
  const totalPoints = employees.reduce((acc, item) => acc + item.points, 0);
  return (
    <div
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className="bg-secondary lg:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-[12px] p-4"
    >
      <div className="flex flex-wrap  gap-3 pb">
        <div className="grid xl:grid-cols-3 2xl:grid-cols-5 md:grid-cols-2 lg:grid-cols-4 w-full lg:w-[calc(75%-6px)] gap-3">
          {cards.map((item, index) => (
            <div
              key={index}
              className=" w-full flex flex-col justify-between rounded-xl text-primary p-4 bg-white"
            >
              <div className="flex flex-wrap gap-3 justify-between items-start">
                <p className="text-sm font-normal text-[#7D7D7D]">
                  {item.title}
                </p>

                <div className="h-9 w-9 rounded-full bg-primary/10 flex justify-center items-center">
                  <Icon icon={item.icon} className="text-primary text-xl" />
                </div>
              </div>

              <p className="xl:text-2xl lg:text-lg font-semibold mt-3">
                {item.count}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl items-end w-full lg:w-[calc(25%-6px)]">
          <PieCharts />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        <div className="bg-white rounded-xl w-full lg:w-[calc(65%-6px)]">
          {" "}
          <Barchart />
        </div>
        <div className="bg-white rounded-xl w-full lg:w-[calc(35%-6px)] p-4 flex flex-col h-[400px]">
          <h2 className="text-sm font-semibold mb-3">
            Top 10 Employees on Leaderboard
          </h2>

          <div className="flex items-center border-b-[0.5px] border-[#7d7d7d]/34 justify-between pb-2">
            <p className="font-semibold text-sm">Employee</p>
            <p className="font-semibold text-sm">Total Points</p>
          </div>

          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex-1 overflow-y-auto"
          >
            {employees.map((emp, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100"
              >
                <p className="font-normal text-sm text-[#272727]/60">
                  {emp.name}
                </p>
                <p className="font-normal text-sm text-[#272727]/60">
                  {emp.points}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t-[0.5px] border-[#7d7d7d]/34 pt-3">
            <p className="font-semibold text-sm">Total</p>
            <p className="font-semibold text-sm">{totalPoints}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
