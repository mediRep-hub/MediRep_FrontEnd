import { GoDotFill } from "react-icons/go";
import LineChart from "../../../Components/LineChart";
import { FcSalesPerformance } from "react-icons/fc";
import { MdOutlineTrendingDown, MdOutlineTrendingUp } from "react-icons/md";
import { FaPercentage } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";
import { FiTarget } from "react-icons/fi";
import SearchBar from "../../../Components/SearchBar";

export default function DistributorDashboard() {
  return (
    <div>
      <div className="sticky top-0">
        {" "}
        <SearchBar />
      </div>
      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="bg-secondary mt-4 md:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-xl p-4 flex flex-col gap-2"
      >
        <div className="flex gap-2 items-stretch flex-wrap">
          <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-16px)] h-[150px] w-full  flex flex-col justify-between rounded-xl text-primary p-4 bg-white">
            <div className="flex justify-between items-start">
              <p className="text-sm font-normal text-[#7D7D7D]">
                Total Sale Today
              </p>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex justify-center items-center">
                <FcSalesPerformance size={18} className="text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div>
                <p className="xl:text-xl lg:text-lg text-heading  font-semibold ">
                  <span className="text-base">Rs.</span>
                  1,975,000
                </p>
                <p className="text-base text-heading">Today Sale</p>
              </div>{" "}
              <div className="border-l-[1px] border-heading h-10"></div>
              <div>
                <p className="xl:text-xl lg:text-lg text-heading  font-semibold ">
                  43
                </p>
                <p className="text-base text-heading">Today Orders</p>
              </div>
            </div>
          </div>

          <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-16px)] h-[150px] w-full  flex flex-col justify-between rounded-xl text-[#28A745] p-4 bg-white">
            <div className="flex justify-between items-start">
              <p className="text-sm font-normal text-[#7D7D7D]">
                Total Sale Value
              </p>
              <div className="h-9 w-9 rounded-full bg-[#28A745]/10 flex justify-center items-center">
                <GiAchievement size={18} color="#28A745" />
              </div>
            </div>
            <div className="flex items-end gap-2 mt-3">
              <p className="xl:text-xl lg:text-lg text-heading  font-semibold ">
                <span className="text-base">Rs.</span>
                1,975,000
              </p>
              <p className="text-sm font-normal">+0.03%</p>
              <MdOutlineTrendingUp color="#28A745" size={18} />
            </div>
          </div>

          <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-16px)] h-[150px] w-full  flex flex-col justify-between rounded-xl text-[#C47301] p-4 bg-white">
            <div className="flex justify-between items-start">
              <p className="text-sm font-normal text-[#7D7D7D]">
                Target Percentage
              </p>
              <div className="h-9 w-9 rounded-full bg-[#C47301]/10 flex justify-center items-center">
                <FaPercentage size={18} color="#C47301" />
              </div>
            </div>{" "}
            <div className="flex items-end gap-2 mt-3">
              <p className="xl:text-xl lg:text-lg text-heading  font-semibold ">
                75%
              </p>
              <p className="text-sm font-normal">-0.03%</p>
              <MdOutlineTrendingDown color="#C47301" size={18} />
            </div>
          </div>

          <div className="lg:w-[calc(25%-6px)] md:w-[calc(50%-16px)] h-[150px] w-full   rounded-xl text-[#E90761] p-4 bg-white">
            <div className="flex justify-between items-start">
              <p className="text-sm font-normal text-[#7D7D7D]">Stock Alert</p>
              <div className="h-9 w-9 rounded-full bg-[#E90761]/10 flex justify-center items-center">
                <FiTarget size={18} color="#E90761" />
              </div>
            </div>
            <div className="flex gap-5 items-center mt-5">
              <div>
                <p className="xl:text-xl lg:text-lg  leading-5 font-semibold">
                  <span className="text-base">Rs.</span> 132,000
                </p>
                <p className="text-xs font-normal">Your Stock</p>
              </div>
              <div className="border-l-[1px] border-[#9C27B0] h-10"></div>
              <div className="text-heading">
                <p className="xl:text-xl lg:text-lg  leading-5 font-semibold">
                  <span className="text-base">Rs.</span> 1,032,000
                </p>
                <p className="text-xs font-normal">Required Stock</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap  items-stretch gap-2">
          <div className="lg:w-[calc(75%-2px)] h-[52vh] w-full bg-white rounded-xl py-5 pr-5">
            <div className="flex flex-wrap xl:gap-5 gap-3 items-center pl-5 mb-4">
              <p className="xl:text-xl md:w-auto w-full sm:text-xl font-semibold text-heading">
                Distributor Performance
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
          <div className="lg:w-[calc(25%-6px)] h-[52vh] w-full bg-[#E5EBF7] rounded-xl p-4">
            <p className="text-heading  text-xs  mb-4">Stock Level In Carton</p>

            <div
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="relative overflow-y-scroll hide-scrollbar h-[calc(49vh-30px)]"
            >
              {[
                "FIX Cefixime 500mg — 4C-8P",
                "Trixone Ceftriaxone 200mg — 4C-8P",
                "Daily Pink -mg — 4C-8P",
                "Cefmax Cefoperazone 1mg — 65",
                "Call/Visit Duration Logged — 4C-8P",
                "LÀ Gem Gemifloxacin Mesylate 320mg — 4C-8P",
                "Tricod Omega 369 Enzyme CoQ 10 -mg — 4C-8P",
                "Xtreme -mg — 4C-8P",
                "Ultra -mg — 3B-7T",
                "Neurox -mg — 5C-2M",
                "Cardex -mg — 1A-9F",
                "Zentrol -mg — 8D-4K",
                "Maxpro -mg — 6P-3L",
                "Primex -mg — 7R-1S",
                "Vitaro -mg — 2H-6Q",
                "Revivo -mg — 9Z-5N",
                "Energo -mg — 4M-8C",
                "Optima -mg — 3T-7E",
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
    </div>
  );
}
