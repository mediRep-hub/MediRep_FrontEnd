import { Icon } from "@iconify/react";
import PieCharts, { Barchart } from "../Components/Charts";
import type { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { getAllDashboardStats, getBarStats } from "../../../api/campsServices";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import CustomInput from "../../../Components/CustomInput";
import CustomSelect from "../../../Components/Select";

export default function CampDashboard() {
  const [animate, setAnimate] = useState(false);
  const { data: allstats } = useQuery<AxiosResponse<any>>({
    queryKey: ["getAllDashboardStats"],
    queryFn: () => getAllDashboardStats(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
  const [isFilter, setFilter] = useState(false);
  const stats = allstats?.data?.data || [];
  console.log("🚀 ~ stats:", stats);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      title: "Planned Camps",
      count: stats?.plannedCamps,
      icon: "icon-park-solid:plan",
    },
    {
      title: "Executed Camps",
      count: stats?.executedCamps,
      icon: "mdi:campfire",
    },
    {
      title: "Total Doctor",
      count: stats?.totalTerritories,
      icon: "healthicons:doctor-male",
    },
    {
      title: "Total Territories",
      count: stats?.totalTerritories,
      icon: "mdi:map-marker-radius",
    },
    {
      title: "Total Patient",
      count: stats?.totalPatients,
      icon: "fa6-solid:bed-pulse",
    },

    {
      title: "Total Chemist",
      count: stats?.totalChemists,
      icon: "mdi:flask-outline",
    },
    {
      title: "Total Products",
      count: stats?.totalProducts,
      icon: "mdi:package-variant-closed",
    },
  ];
  const pieData = [
    {
      name: "Approved",
      value: stats?.totalApproved || 0,
    },
    {
      name: "Executed",
      value: stats?.totalCompleted || 0,
    },
    {
      name: "Pending",
      value: stats?.totalPending || 0,
    },
    {
      name: "Rejected",
      value: stats?.totalRejected || 0,
    },
  ];
  const barData = [...(stats?.barData || [])].sort(
    (a, b) => b.planned - a.planned,
  );
  return (
    <>
      <div
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="bg-secondary lg:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-[12px] p-4"
      >
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <p className="text-heading font-medium text-[22px]">
              Camps Dashboard
            </p>{" "}
            <MonthYearPicker />{" "}
          </div>
          <button
            onClick={() => {
              setFilter(true);
            }}
            className="h-14 w-[128px] bg-primary rounded-md items-center  text-white justify-center gap-2 flex"
          >
            <Icon icon="mingcute:add-fill" className="" />
            <p>Filters</p>
          </button>
        </div>
        <div className="flex flex-wrap  gap-3 pb mt-3">
          <div className="grid xl:grid-cols-4 2xl:grid-cols-5 md:grid-cols-3 lg:grid-cols-3 w-full lg:w-[calc(75%-6px)] gap-3">
            {/* {cards.map((item, index) => (
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
            ))} */}

            {cards.map((item, index) => (
              <div
                key={index}
                className="w-full flex flex-col items-center text-center justify-between rounded-xl text-primary p-6 bg-white"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex justify-center items-center">
                    <Icon icon={item.icon} className="text-primary text-xl" />
                  </div>

                  <p className="text-sm font-normal text-[#7D7D7D]">
                    {item.title}
                  </p>
                </div>

                {/* Increased text sizes: text-3xl to 4xl for a bolder look */}
                <p className="xl:text-4xl lg:text-3xl text-2xl font-bold mt-4">
                  {item.count}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl items-end w-full lg:w-[calc(25%-6px)]">
            <PieCharts pieData={pieData} total={stats?.plannedCamps} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="bg-white rounded-xl w-full ">
            {" "}
            <Barchart data={barData} />
          </div>
          {/* <div className="bg-white rounded-xl w-full lg:w-[calc(35%-6px)] p-4 flex flex-col h-[400px]">
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
        </div> */}
        </div>
      </div>
      {isFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end items-center z-50">
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className={`bg-white
          rounded-xl md:rounded-tl-xl md:rounded-bl-xl md:rounded-tr-none md:rounded-br-none
          xl:mx-0 mx-5 md:mx-0
          w-[500px] h-[90vh] md:h-[100vh] overflow-y-auto
          shadow-xl relative
          transform transition-transform duration-500 ease-in-out
          ${animate ? "translate-x-0" : "translate-x-full"}
        `}
          >
            <div className="flex items-center xl:p-6 p-4  bg-[#E5EBF7] justify-between">
              <p className="text-[24px] text-heading capitalize font-semibold">
                Select Filters
              </p>
              <div className="h-[35px] group w-[35px] p-2 rounded-full  hover:shadow-[rgba(99,99,99,0.25)_0px_4px_12px_2px] flex items-center justify-center">
                <div className="group-hover:bg-white">
                  <IoMdCloseCircle
                    size={24}
                    onClick={() => {
                      setFilter(false);
                    }}
                    className="cursor-pointer text-primary"
                  />
                </div>
              </div>
            </div>
            <div className="xl:p-6 p-4 space-y-3">
              <CustomSelect
                placeholder="Status"
                options={["Pending", "Approved", "Rejected", "Completed"]}
              />
              <CustomInput label="Brick Code" />
              <CustomInput label="Camp Type" />
              <CustomInput label="Doctor" />
              <CustomInput label="Chemist" />
              {/* <CustomInput />
              <CustomInput />
              <CustomInput />
              <CustomInput />
              <CustomInput /> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
