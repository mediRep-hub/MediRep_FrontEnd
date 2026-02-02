import { Icon } from "@iconify/react";
import { MonthYearPicker } from "../../Components/FilterMonthYear";
import CustomTable from "../../Components/CustomTable";

const Titles = [
  "Plan ID",
  "MR Name",
  "Time Period",
  "Total Doctors",
  "Total Visits",
  "Status",
  "Deviation",
];

const Data = [
  [
    "PLN-007",
    "Razan Suleiman",
    "Weekly Plan (Jan 22 – Jan 27)",
    <p className="text-primary underline">48</p>,
    <p className="text-primary underline">-</p>,
    <p className="border border-[#E90761] text-[#E90761] font-medium px-2 py-0.5 rounded-sm w-max">
      Pending
    </p>,
    <div className="flex gap-2 items-center">
      <Icon
        icon="icon-park-outline:dot"
        width="16"
        height="16"
        color="#FF383C"
      />
      <p>-</p>
    </div>,
  ],
  [
    "PLN-008",
    "Ahmed Khan",
    "Weekly Plan (Jan 28 – Feb 02)",
    <p className="text-primary underline">36</p>,
    <p className="text-primary underline">12</p>,
    <p className="border border-[#0BA69C] text-[#0BA69C] font-medium px-2 py-0.5 rounded-sm w-max">
      Approved
    </p>,
    <div className="flex gap-2 items-center">
      <Icon
        icon="icon-park-outline:dot"
        width="16"
        height="16"
        color="#0BA69C"
      />
      <p>Devotion</p>
    </div>,
  ],
  [
    "PLN-009",
    "Bilal Hassan",
    "Weekly Plan (Feb 03 – Feb 08)",
    <p className="text-primary underline">52</p>,
    <p className="text-primary underline">30</p>,
    <p className="border border-[#E90761] text-[#E90761] font-medium px-2 py-0.5 rounded-sm w-max">
      Pending
    </p>,
    <div className="flex gap-2 items-center">
      <Icon
        icon="icon-park-outline:dot"
        width="16"
        height="16"
        color="#FF383C"
      />
      <p>Delayed</p>
    </div>,
  ],
  [
    "PLN-010",
    "Sara Malik",
    "Weekly Plan (Feb 09 – Feb 14)",
    <p className="text-primary underline">40</p>,
    <p className="text-primary underline">40</p>,
    <p className="border border-[#0BA69C] text-[#0BA69C] font-medium px-2 py-0.5 rounded-sm w-max">
      Approved
    </p>,
    <div className="flex gap-2 items-center">
      <Icon
        icon="icon-park-outline:dot"
        width="16"
        height="16"
        color="#0BA69C"
      />
      <p>On route</p>
    </div>,
  ],
];

export default function PlanSummary() {
  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-start">
        <div className="flex flex-wrap md:flex-nowrap w-full items-center gap-4">
          <p className="text-heading w-full lg:w-[185px] font-medium text-[22px] sm:text-[24px]">
            Plan Summary
          </p>
          <div className="w-full">
            <MonthYearPicker />
          </div>
        </div>
        <div className="flex w-full md:w-auto flex-wrap md:flex-nowrap items-center gap-4">
          <button className="h-[55px] w-full md:w-[140px] lg:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <Icon
              icon="solar:download-broken"
              height="24"
              width="24"
              color="#0755E9"
            />
            <p className="text-primary text-base font-medium">Download</p>
          </button>{" "}
          <button className="h-[55px] w-full md:w-[170px] lg:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
            <Icon
              icon="mingcute:add-fill"
              height="20"
              width="20"
              color="#fff"
            />
            <p className="text-white text-base font-medium">Generate Reports</p>
          </button>
        </div>
      </div>
      <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(76vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
        <p className="text-[#7D7D7D] font-medium text-sm">Plan Summary</p>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(69vh-0px)] xl:h-[calc(53vh-0px)]  mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={Titles} data={Data} />
        </div>
      </div>
    </div>
  );
}
