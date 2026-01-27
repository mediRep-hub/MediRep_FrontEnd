import { useEffect } from "react";
import { MdOutlineTrendingDown, MdOutlineTrendingUp } from "react-icons/md";
import { FaPercentage } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";
import LineChart from "../../Components/LineChart";
import { GoDotFill } from "react-icons/go";
import { FiTarget } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { getAllProducts } from "../../api/productServices";
import { useQuery } from "@tanstack/react-query";

export default function DashBoard() {
  const { data, refetch } = useQuery({
    queryKey: ["AllProducts"],
    queryFn: () => getAllProducts(),
    staleTime: 5 * 60 * 1000,
  });
  let ProductData = data?.data?.totalSummary;

  useEffect(() => {
    refetch;
    document.title = "MediRep | Dashboard";
  }, []);

  return (
    <div
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="bg-secondary md:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-xl p-4 flex flex-col gap-2"
    >
      <div className="flex gap-2 items-stretch flex-wrap">
        <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-4px)] h-[130px] w-full  flex flex-col justify-between rounded-xl text-primary p-4 bg-white">
          <div className="flex justify-between items-start">
            <p className="text-sm font-normal text-[#7D7D7D]">Target</p>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex justify-center items-center">
              <FiTarget size={18} className="text-primary" />
            </div>
          </div>
          <p className="xl:text-xl lg:text-lg  font-semibold mt-3">
            {ProductData?.totalTarget}
          </p>
        </div>

        <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-4px)] h-[130px] w-full  flex flex-col justify-between rounded-xl text-[#28A745] p-4 bg-white">
          <div className="flex justify-between items-start">
            <p className="text-sm font-normal text-[#7D7D7D]">Achievement</p>
            <div className="h-9 w-9 rounded-full bg-[#28A745]/10 flex justify-center items-center">
              <GiAchievement size={18} color="#28A745" />
            </div>
          </div>
          <div className="flex items-end gap-2 mt-3">
            <p className="xl:text-xl lg:text-lg  font-semibold ">
              {" "}
              {ProductData?.totalAchievement}
            </p>
            <p className="text-sm font-normal">+0.03%</p>
            <MdOutlineTrendingUp color="#28A745" size={18} />
          </div>
        </div>

        <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-4px)] h-[130px] w-full  flex flex-col justify-between rounded-xl text-[#C47301] p-4 bg-white">
          <div className="flex justify-between items-start">
            <p className="text-sm font-normal text-[#7D7D7D]">Percentage</p>
            <div className="h-9 w-9 rounded-full bg-[#C47301]/10 flex justify-center items-center">
              <FaPercentage size={18} color="#C47301" />
            </div>
          </div>{" "}
          <div className="flex items-end gap-2 mt-3">
            <p className="xl:text-xl lg:text-lg  font-semibold ">
              {ProductData?.percentage?.toFixed(4)}%
            </p>
            <p className="text-sm font-normal">-0.03%</p>
            <MdOutlineTrendingDown color="#C47301" size={18} />
          </div>
        </div>

        <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-4px)] h-[130px] w-full   rounded-xl text-[#9C27B0] p-4 bg-white">
          <div className="flex justify-between items-start">
            <p className="text-sm font-normal text-[#7D7D7D]">
              Engagement with KOL
            </p>
            <div className="h-9 w-9 rounded-full bg-[#9C27B0]/10 flex justify-center items-center">
              <HiUsers size={18} color="#9C27B0" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-5">
            <div>
              <p className="xl:text-xl lg:text-lg  leading-5 font-semibold">
                220
              </p>
              <p className="text-xs font-normal">Meetings</p>
            </div>
            <div className="border-l-[1px] border-[#9C27B0] h-10"></div>
            <div>
              <p className="xl:text-xl lg:text-lg  leading-5 font-semibold">
                220
              </p>
              <p className="text-xs font-normal">Meetings</p>
            </div>
            <div className="border-l-[1px] border-[#9C27B0] h-10"></div>
            <p className="xl:text-xl lg:text-lg  font-semibold">60%</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap  items-stretch gap-2">
        <div className="lg:w-[calc(75%-2px)] h-[53.5vh] w-full bg-white rounded-xl py-5 pr-5">
          <div className="flex flex-wrap xl:gap-5 gap-3 items-center pl-5 mb-4">
            <p className="xl:text-xl md:w-auto w-full sm:text-xl font-semibold text-heading">
              Performance
            </p>
            <div className="h-3 border-[#7d7d7d] border-l-[1px]"></div>
            <div className="flex items-center gap-2">
              <GoDotFill color="#0755E9" />
              <p className="text-sm  font-medium text-heading">Target</p>
            </div>{" "}
            <div className="flex items-center gap-2">
              <GoDotFill color="#14CCC2" />
              <p className="text-sm font-medium text-heading">Achievement</p>
            </div>
          </div>
          <div className="h-[90%] md:h-[100%]">
            <LineChart />
          </div>
        </div>
        <div className="lg:w-[calc(25%-6px)] h-[53.5vh] w-full bg-[#E5EBF7] rounded-xl p-4">
          <p className="text-heading  text-xs  mb-4">MR Activity by Type</p>

          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="relative overflow-y-scroll hide-scrollbar h-[calc(49vh-30px)]"
          >
            {[
              "New Doctor Meetings — 48",
              "Follow-up Meetings — 32",
              "Product Presentations — 21",
              "Samples Distributed — 65",
              "Call/Visit Duration Logged — 112 hrs",
              "Orders Taken — 39",
              "New Doctor Meetings — 48",
              "Follow-up Meetings — 32",
              "Product Presentations — 21",
              "Samples Distributed — 65",
              "Call/Visit Duration Logged — 112 hrs",
              "Orders Taken — 39",
              "New Doctor Meetings — 48",
              "Follow-up Meetings — 32",
              "Product Presentations — 21",
              "Samples Distributed — 65",
              "Call/Visit Duration Logged — 112 hrs",
              "Orders Taken — 39",
            ].map((item, index, arr) => (
              <div
                key={index}
                className="relative flex  items-center mb-5 last:mb-0"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <div className="h-3 w-3 rounded-full bg-white border-[1px] border-primary relative z-10"></div>

                  {index !== arr.length - 1 && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-primary"></div>
                  )}
                </div>
                <span className="ml-3 xl:text-xs lg:text-xs md:text-sm text-xs text-heading pl-4">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
