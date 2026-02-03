import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { useState } from "react";
import ReportFilterModalStatic from "../../../Components/ReportFilter";
const titles = [
  "Month",
  "Total Claim",
  "Approved",
  "Rejected",
  "Paid",
  "Pending",
];
const Data = [
  [
    "January",
    <p>
      <span className="text-xs">Rs:</span>12,785,100
    </p>,
    <p>
      <span className="text-xs">Rs:</span>950,605
    </p>,
    <p>
      <span className="text-xs">Rs:</span>10,500
    </p>,
    <p>
      <span className="text-xs">Rs:</span>14,071
    </p>,
    <p>
      <span className="text-xs">Rs:</span>12,785,100
    </p>,
  ],
  [
    "February",
    <p>
      <span className="text-xs">Rs:</span>8,500,000
    </p>,
    <p>
      <span className="text-xs">Rs:</span>500,000
    </p>,
    <p>
      <span className="text-xs">Rs:</span>10,500
    </p>,
    <p>
      <span className="text-xs">Rs:</span>950,605
    </p>,
    <p>
      <span className="text-xs">Rs:</span>8,500,000
    </p>,
  ],
];
export default function MonthlyTEReport() {
  const [generateReport, setGenerateReport] = useState(false);
  const handleClose = () => {
    setGenerateReport(false);
  };
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-center">
          <div className="flex flex-wrap md:flex-nowrap w-full items-center gap-4">
            <p className="text-heading leading-[100%] w-full lg:w-[270px] font-medium text-[22px] sm:text-[24px]">
              Monthly T&E Report
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
            <button
              onClick={() => {
                setGenerateReport(true);
              }}
              className="h-[55px] w-full md:w-[170px] lg:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white text-base font-medium">
                Generate Reports
              </p>
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
            <CustomTable titles={titles} data={Data} />
          </div>
        </div>
      </div>{" "}
      {generateReport && <ReportFilterModalStatic close={handleClose} />}
    </>
  );
}
