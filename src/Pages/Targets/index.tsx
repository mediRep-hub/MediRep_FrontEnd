import React from "react";
import CustomTable from "../../Components/CustomTable";
import { MdAdd } from "react-icons/md";
import { LuSearch } from "react-icons/lu";

const titles = [
  <div className="relative">
    <div className="absolute  inset-y-0 left-2 flex items-center gap-1 text-gray-600 pointer-events-none">
      <LuSearch size={14} />
      <span className="text-xs font-medium">SKU</span>
    </div>
    <input
      type="text"
      className="h-8 pl-16 pr-3 border border-gray-400 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
    />
  </div>,
  <div className="relative">
    <div className="absolute  inset-y-0 left-2 flex items-center gap-1 text-gray-600 pointer-events-none">
      <LuSearch size={14} />
      <span className="text-xs font-medium">Product Name</span>
    </div>
    <input
      type="text"
      className="h-8 pl-16 pr-3 border border-gray-400 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
    />
  </div>,
  "Form",
  "Status",
  "Enter Target",
  "Achievement",
  "Actions",
];
export default function Tragets() {
  return (
    <div>
      {" "}
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Target
          </p>
          <button className="h-[55px] w-full md:w-[180px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <MdAdd size={20} color="#fff" />{" "}
            <p className="text-white text-base font-medium">Upload Target</p>
          </button>
        </div>
        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(90vh-137px)] xl:h-[calc(90vh-169px)] h-auto ">
          <p className="text-[#7D7D7D] font-medium text-sm">Targets List</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(85vh-157px)] xl:h-[calc(65vh-79px)]  mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={titles} />
          </div>
        </div>
      </div>
    </div>
  );
}
