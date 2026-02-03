import { Icon } from "@iconify/react";
import { MonthYearPicker } from "../../Components/FilterMonthYear";
import CustomTable from "../../Components/CustomTable";
import { LuSearch } from "react-icons/lu";
const titles = [
  "Order ID",
  "MR Name",
  "Doctor/Pharmacy Name",
  <div className="relative flex items-center w-[250px]">
    <LuSearch className="absolute left-2 text-[#7d7d7d]" size={14} />

    <input
      placeholder="Distributor Name"
      type="text"
      className="h-8 pl-[30px] pr-3 w-full border font-normal border-gray-400 rounded-md text-xs text-heading focus:outline-none"
    />
  </div>,
  "Discount",
  "Discounted Sale",
  "Sale",
];
const tableData = [
  [
    "ORD-25-11621",
    "Cristofer Schleifer",
    "Dr. Ahmed Pharmacy",
    "Noorsons",
    "5%",
    <p>
      <span className="text-[10px]">Rs:</span>110,235
    </p>,
    <p>
      <span className="text-[10px]">Rs:</span>15,000
    </p>,
  ],
  [
    "ORD-25-11622",
    "Paul Walker",
    "Dr. Salman Clinic",
    "Ocean Group",
    "10%",
    <p>
      <span className="text-[10px]">Rs:</span>120,000
    </p>,
    <p>
      <span className="text-[10px]">Rs:</span>18,000
    </p>,
  ],
];
export default function TrackSale() {
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <div className="flex items-center gap-4">
          <p className="text-heading font-medium text-[22px] sm:text-[24px]">
            Orders
          </p>
          <MonthYearPicker />
        </div>{" "}
        <button className="h-[55px] w-full md:w-[150px] lg:w-[180px] flex items-center justify-center gap-3 rounded-[6px] bg-[#E5EBF7]">
          <Icon
            icon="solar:download-broken"
            height="24"
            width="24"
            color="#0755E9"
          />
          <p className="text-primary text-base font-medium ml-2">Download</p>
        </button>
      </div>
      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.5vh-0px)] xl:h-[calc(64vh-0px)] h-auto">
        <p className="text-[#7D7D7D] font-medium text-sm">Orders List</p>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl mt-4 overflow-y-auto scrollbar-none 2xl:h-[calc(68.5vh-0px)] xl:h-[calc(53vh-0px)]"
        >
          {" "}
          <CustomTable titles={titles} data={tableData} />
        </div>
      </div>
    </div>
  );
}
