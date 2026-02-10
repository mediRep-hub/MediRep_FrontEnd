import { useEffect } from "react";
import CustomTable from "../../../Components/CustomTable";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { Icon } from "@iconify/react";

const titles = [
  "Product Name",
  "Distribution Name",
  "Brick Name",
  "Distributed Qty",
  "Gross Value",
  "Discount %",
  "Net Value",
  "Chanel",
  "Contribution %",
  "Growth",
];

const Data = [
  [
    "Amoxicillin",
    "Distributor A",
    "Canal Road",
    "4500",
    <p>
      <span className="text-xs">Rs:</span>500
    </p>,
    "10%",
    <p>
      <span className="text-xs">Rs:</span>1250000
    </p>,
    "RT",
    "25%",
    "5%",
  ],
  [
    "Paracetamol",
    "Distributor B",
    "Gulgasht",
    "3200",
    <p>
      <span className="text-xs">Rs:</span>350
    </p>,
    "8%",
    <p>
      <span className="text-xs">Rs:</span>1120000
    </p>,
    "RT",
    "20%",
    "4%",
  ],
  [
    "Ibuprofen",
    "Distributor C",
    "Model Town",
    "2800",
    <p>
      <span className="text-xs">Rs:</span>420
    </p>,
    "12%",
    <p>
      <span className="text-xs">Rs:</span>1176000
    </p>,
    "RT",
    "18%",
    "3%",
  ],
  [
    "Metformin",
    "Distributor D",
    "Johar Town",
    "5000",
    <p>
      <span className="text-xs">Rs:</span>600
    </p>,
    "15%",
    <p>
      <span className="text-xs">Rs:</span>1500000
    </p>,
    "RT",
    "22%",
    "6%",
  ],
];

export default function ProductWiseDistribution() {
  useEffect(() => {
    document.title = "MediRep | Product Wise Distribution";
  }, []);

  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-center">
        <div className="flex flex-wrap md:flex-nowrap w-full items-center gap-4">
          <p className="text-heading w-full lg:w-[290px] font-medium text-[22px] sm:text-[24px]">
            Product Wise Distribution
          </p>
          <div className="w-full">
            <MonthYearPicker />
          </div>
        </div>
        <div className="flex w-full md:w-auto flex-wrap md:flex-nowrap items-center gap-3">
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
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(69vh-0px)] xl:h-[calc(54.5vh-0px)]  mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={titles} data={Data} />
        </div>
      </div>
    </div>
  );
}
