import SearchBar from "../../../Components/SearchBar";
import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import Pagination from "../../../Components/Pagination";
import { useEffect } from "react";

const titles = [
  "Invoice ID",
  "Invoice Date",
  "Invoice Name",
  "Number of SKU",
  "Total Carton",
  "Invoice Value",
  "Details",
];
const data = [
  ["INV001", "2025-11-26", "Office Supplies", 5, 10, 1500, "View"],
  ["INV002", "2025-11-25", "Electronics", 3, 5, 7500, "View"],
  ["INV003", "2025-11-24", "Furniture", 2, 2, 12000, "View"],
  ["INV004", "2025-11-23", "Stationery", 10, 15, 2500, "View"],
  ["INV005", "2025-11-22", "Software License", 1, 1, 5000, "View"],
];

export default function PrimarySale() {
  useEffect(() => {
    document.title = "MediRep | Primary Sale";
  }, []);
  return (
    <div>
      <>
        <div className="sticky top-0">
          <SearchBar />
        </div>
        <div className="mt-4">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="bg-secondary md:h-[calc(100vh-129px)] overflow-y-auto h-auto rounded-xl p-4 flex flex-col gap-4"
          >
            {" "}
            <div className="flex flex-wrap gap-4 items-start justify-between">
              <p className="text-heading font-medium text-[22px] sm:text-[24px]">
                Primary Sale
              </p>
              <div className="flex items-center gap-4 md:w-auto w-full">
                <button className="h-[55px] w-full md:w-[70px] bg-[#E90761]/10 rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
                  <Icon
                    icon="material-symbols-light:assignment-return"
                    className="text-[#E907617A] text-[24px]"
                  />
                </button>{" "}
                <button className="h-[55px] w-full md:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
                  <Icon
                    icon="material-symbols-light:bucket-check-rounded"
                    className="text-primary text-[24px]"
                  />
                  <p className="text-primary">GRN</p>
                </button>{" "}
                <button className="h-[55px] w-full md:w-[180px] text-white bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center">
                  <Icon
                    icon="material-symbols-light:add-box-rounded"
                    className="text-white text-[24px]"
                  />
                  PO
                </button>{" "}
              </div>
            </div>
            <div className="bg-[#E5EBF7] rounded-[12px] p-4 2xl:h-[calc(89vh-125px)] lg:h-[calc(90vh-162px)] h-auto ">
              <div className="flex justify-between items-center">
                <p className="text-[#7D7D7D] text-sm leading-[100%]">
                  Invoice List
                </p>
                <Pagination />
              </div>
              <div
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                className="bg-white border-2 mt-3 border-primary w-full 2xl:h-[calc(70vh-14px)] xl:h-[calc(55vh-13px)]  overflow-y-auto h-auto rounded-xl"
              >
                {" "}
                <CustomTable titles={titles} data={data} />
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
