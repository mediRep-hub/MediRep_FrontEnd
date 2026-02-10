import { Icon } from "@iconify/react";
import { MonthYearPicker } from "../../Components/FilterMonthYear";
import CustomTable from "../../Components/CustomTable";
import { useEffect, useState } from "react";
import ReportFilterModalStatic from "../../Components/ReportFilter";

const Titles = [
  "Plan ID",
  "MR Name",
  "Week",
  "To Doctors Planned",
  "Planned Visits",
  "Actual Visits",
  "Submitted On",
];
const Data = [
  [
    "PLN007",
    "Ali Al Ghafli",
    "Weekly Plan (Jan 22 – Jan 27)",
    "48",
    "48",
    "48",
    "Sep 20, 2025",
  ],
  [
    "PLN008",
    "Sara Malik",
    "Weekly Plan (Jan 28 – Feb 03)",
    "36",
    "35",
    "34",
    "Sep 21, 2025",
  ],
  [
    "PLN009",
    "Bilal Hassan",
    "Weekly Plan (Feb 04 – Feb 10)",
    "52",
    "50",
    "51",
    "Sep 22, 2025",
  ],
  [
    "PLN010",
    "Ahmed Khan",
    "Weekly Plan (Feb 11 – Feb 17)",
    "40",
    "38",
    "39",
    "Sep 23, 2025",
  ],
  [
    "PLN011",
    "Razan Suleiman",
    "Weekly Plan (Feb 18 – Feb 24)",
    "48",
    "47",
    "46",
    "Sep 24, 2025",
  ],
];

export default function WeeklyPlans() {
  const [generateReport, setGenerateReport] = useState(false);
  const handleClose = () => {
    setGenerateReport(false);
  };
  useEffect(() => {
    document.title = "MediRep | Weekly Plans";
  }, []);
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-start">
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
            <p className="text-heading w-full lg:w-[230px] font-medium text-[22px] sm:text-[24px]">
              Weekly Plans
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
        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(76vh-0px)] xl:h-[calc(66vh-0px)] h-auto ">
          <p className="text-[#7D7D7D] font-medium text-sm">Plan Summary</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(69vh-0px)] xl:h-[calc(56vh-0px)]  mt-4 overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={Titles} data={Data} />
          </div>
        </div>
      </div>
      {generateReport && <ReportFilterModalStatic close={handleClose} />}
    </>
  );
}
